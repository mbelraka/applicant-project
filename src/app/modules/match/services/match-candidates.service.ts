import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  catchError,
  map,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

import { APP_CONFIG } from '../../../config/app.config';
import { Languages } from '../../../enums/language.enum';
import { MATCH_SCORE_PREFIX } from '../../../utilities/RegEx';
import { Applicant } from '../../applicants/models/applicant.model';
import { MatchApiResponse } from '../models/match-api-response.model';
import { MatchCandidateResult } from '../models/match-candidate-result.model';
import { MatchScoreItem } from '../models/match-score-item.model';
import { ParsedMatchScoreItem } from '../models/parsed-match-score-item.model';

@Injectable({ providedIn: 'root' })
export class MatchCandidatesService {
  private get config() {
    return APP_CONFIG.MATCH;
  }

  public constructor(private readonly _http: HttpClient) {}

  public evaluate(
    jobDescription: string,
    applicants: Applicant[],
    topCandidatesCount: number,
    language: Languages
  ): Observable<MatchCandidateResult[]> {
    if (!jobDescription.trim()) {
      return throwError(
        () => new Error(this.config.ERRORS.MISSING_JOB_DESCRIPTION)
      );
    }
    if (applicants.length === 0) {
      return throwError(
        () => new Error(this.config.ERRORS.NO_APPLICANTS_AVAILABLE)
      );
    }
    const stableApplicants = this._sortApplicantsForMatching(applicants);

    return this._http
      .post<MatchApiResponse>(
        this._buildGroqMatchUrl(),
        this._buildGroqMatchRequestBody(
          jobDescription,
          stableApplicants,
          language
        )
      )
      .pipe(
        timeout({ first: this.config.REQUEST_TIMEOUT_MS }),
        map((response) => this._parseGroqScores(response)),
        map((parsedScores) =>
          this._mergeAndRankResults(
            stableApplicants,
            parsedScores,
            topCandidatesCount
          )
        ),
        catchError((error: unknown) =>
          throwError(() => this._toServiceError(error))
        )
      );
  }

  private _sortApplicantsForMatching(applicants: Applicant[]): Applicant[] {
    return [...applicants].sort((a, b) => {
      const byId = String(a.id).localeCompare(String(b.id));
      if (byId !== 0) {
        return byId;
      }
      return (a.name ?? '').localeCompare(b.name ?? '');
    });
  }

  private _extractBackendErrorMessage(error: unknown): string | null {
    if (error instanceof HttpErrorResponse) {
      const payload = error.error;
      if (typeof payload === 'string' && payload.trim()) {
        return payload.trim();
      }
      if (
        payload &&
        typeof payload === 'object' &&
        'error' in payload &&
        typeof (payload as { error?: unknown }).error === 'string'
      ) {
        const message = (payload as { error: string }).error.trim();
        if (message) {
          return message;
        }
      }
    }
    if (error instanceof Error && error.message.trim()) {
      return error.message.trim();
    }
    return null;
  }

  private _buildGroqMatchUrl(): string {
    return this.config.GROQ.MATCH_ENDPOINT;
  }

  private _buildGroqMatchRequestBody(
    jobDescription: string,
    applicants: Applicant[],
    language: Languages
  ) {
    return {
      model: this.config.GROQ.MODEL,
      temperature: this.config.GROQ.TEMPERATURE,
      deterministic: this.config.GROQ.DETERMINISTIC_SCORING,
      language,
      locale: APP_CONFIG.getLocale(language),
      jobDescription: jobDescription.trim(),
      candidates: applicants.map((applicant) =>
        this._toGroqCandidatePayload(applicant)
      ),
    };
  }

  private _parseGroqScores(response: MatchApiResponse): ParsedMatchScoreItem[] {
    return this._getRawScores(response)
      .map((item, index) => this._toParsedScoreItem(item, index))
      .filter((item): item is ParsedMatchScoreItem => item !== null);
  }

  private _sanitizeRecommendationText(text: string): string {
    return text.replace(MATCH_SCORE_PREFIX, '').trim();
  }

  private _extractId(item: MatchScoreItem): string | null {
    const raw = item.id ?? item.candidateId ?? item.applicantId;
    if (raw === null || raw === undefined) {
      return null;
    }
    const normalized = String(raw).trim();
    return normalized || null;
  }

  private _extractName(item: MatchScoreItem): string | undefined {
    const raw = item.name ?? item.candidateName ?? item.applicantName;
    if (!raw) {
      return undefined;
    }
    const normalized = raw.trim();
    return normalized || undefined;
  }

  private _normalizeName(value: string | undefined): string {
    return (value ?? '').trim().toLowerCase();
  }

  private _parseScore(
    item: Omit<MatchScoreItem, 'id'> & { id?: string | number | null }
  ): number {
    const raw =
      item.matchScore ??
      item.score ??
      item.overallScore ??
      item.totalScore ??
      item.matchingScore ??
      0;

    return this._parseNumericScore(raw);
  }

  private _parseNumericScore(raw: unknown): number {
    const parsed = this._extractNumber(raw);
    if (!Number.isFinite(parsed)) {
      return this.config.SCORE.MIN;
    }

    // Some models return confidence in 0..1 range. Normalize to percentage.
    const normalized = parsed > 0 && parsed <= 1 ? parsed * 100 : parsed;
    return this._clampScore(normalized);
  }

  private _extractNumber(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const text = value.trim();
      if (!text) {
        return Number.NaN;
      }
      const numeric = text.replace(',', '.').replace(/[^\d.-]/g, '');
      return Number(numeric);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return Number.NaN;
      }
      return this._extractNumber(value[0]);
    }

    if (value && typeof value === 'object') {
      const candidate = value as Record<string, unknown>;
      const knownKeys = [
        'value',
        'score',
        'matchScore',
        'overallScore',
        'totalScore',
        'matchingScore',
        'percent',
        'percentage',
      ] as const;
      for (const key of knownKeys) {
        if (key in candidate) {
          const nested = this._extractNumber(candidate[key]);
          if (Number.isFinite(nested)) {
            return nested;
          }
        }
      }
    }

    return Number.NaN;
  }

  private _clampScore(value: number): number {
    const n = Number(value);
    if (!Number.isFinite(n)) {
      return this.config.SCORE.MIN;
    }
    const clamped = Math.max(
      this.config.SCORE.MIN,
      Math.min(this.config.SCORE.MAX, n)
    );
    return Math.round(clamped);
  }

  private _mergeAndRankResults(
    applicants: Applicant[],
    scores: ParsedMatchScoreItem[],
    topCandidatesCount: number
  ): MatchCandidateResult[] {
    const scoreById = new Map(
      scores
        .filter((item) => item.id.trim().length > 0)
        .map((item) => [item.id, item] as const)
    );
    const scoreByName = new Map(
      scores
        .filter((s) => this._normalizeName(s.name).length > 0)
        .map((s) => [this._normalizeName(s.name), s] as const)
    );
    const scoreByIndex = new Map(
      scores.map((item) => [item.sourceIndex, item])
    );
    const consumed = new Set<ParsedMatchScoreItem>();

    const merged = applicants.map((applicant, applicantIndex) => {
      const idCandidate = scoreById.get(applicant.id);
      const nameCandidate = scoreByName.get(
        this._normalizeName(applicant.name)
      );
      const indexCandidate =
        applicants.length === scores.length
          ? scoreByIndex.get(applicantIndex)
          : undefined;
      const scoreItem = [idCandidate, nameCandidate, indexCandidate].find(
        (candidate) => candidate && !consumed.has(candidate)
      );
      if (scoreItem) {
        consumed.add(scoreItem);
      }
      const recommendation = scoreItem?.recommendation ?? '';

      return {
        applicant,
        score: scoreItem?.matchScore ?? this.config.SCORE.MIN,
        reasoning: recommendation,
        matchingSkills: scoreItem?.matchingSkills ?? [],
        missingSkills: scoreItem?.missingSkills ?? [],
        candidateProfile: {
          skills: scoreItem?.candidateProfile?.skills ?? [],
          yearsExperience: scoreItem?.candidateProfile?.yearsExperience ?? 0,
          topJobTitles: scoreItem?.candidateProfile?.topJobTitles ?? [],
          education: scoreItem?.candidateProfile?.education ?? '',
        },
        recommendation,
        isTopCandidate: false,
      };
    });

    const ranked = [...merged].sort((a, b) => b.score - a.score);
    const topN = Math.max(0, Math.floor(topCandidatesCount));
    return ranked.map((candidate, index) => ({
      ...candidate,
      isTopCandidate: index < topN,
    }));
  }

  private _toServiceError(error: unknown): Error {
    const message =
      error instanceof TimeoutError
        ? this.config.ERRORS.GROQ_REQUEST_TIMEOUT
        : (this._extractBackendErrorMessage(error) ??
          this.config.ERRORS.GROQ_PROXY_UNREACHABLE);
    return new Error(message);
  }

  private _toGroqCandidatePayload(applicant: Applicant) {
    return {
      id: applicant.id,
      name: applicant.name ?? '',
      skills: applicant.skills ?? [],
      yearsOfExperience: applicant.yearsOfExperience ?? null,
      currentJobTitle: applicant.currentJobTitle ?? '',
      applicationStatus: applicant.applicationStatus ?? '',
      location: applicant.location ?? '',
      notes: applicant.notes ?? '',
    };
  }

  private _getRawScores(response: MatchApiResponse): MatchScoreItem[] {
    return response.scores ?? response.results ?? response.candidates ?? [];
  }

  private _toParsedScoreItem(
    item: MatchScoreItem,
    sourceIndex: number
  ): ParsedMatchScoreItem | null {
    const id = this._extractId(item) ?? '';
    const name = this._extractName(item);
    const hasIdentity =
      id.trim().length > 0 || this._normalizeName(name).length > 0;
    if (!hasIdentity) {
      return null;
    }

    return {
      ...item,
      id,
      sourceIndex,
      name,
      matchScore: this._parseScore(item),
      matchingSkills: item.matchingSkills ?? [],
      missingSkills: item.missingSkills ?? [],
      candidateProfile: {
        skills: item.candidateProfile?.skills ?? [],
        yearsExperience: Number(item.candidateProfile?.yearsExperience ?? 0),
        topJobTitles: item.candidateProfile?.topJobTitles ?? [],
        education: item.candidateProfile?.education ?? '',
      },
      recommendation: this._sanitizeRecommendationText(
        item.recommendation?.trim() ?? item.reasoning?.trim() ?? ''
      ),
    };
  }
}
