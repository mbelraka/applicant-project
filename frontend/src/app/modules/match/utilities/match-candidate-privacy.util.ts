import { Applicant } from '../../applicants/models/applicant.model';

import type { PrivacyPreservingCandidatePayload } from '../models/privacy-preserving-candidate-payload.model';

/** One disposable id per candidate per match request — not an internal applicant key. */
export function createMatchLlmCorrelationId(): string {
  return globalThis.crypto.randomUUID();
}

export function toPrivacyPreservingCandidatePayload(
  applicant: Applicant,
  llmCorrelationId: string
): PrivacyPreservingCandidatePayload {
  const rawYoe = applicant.yearsOfExperience;
  const yoe =
    rawYoe === undefined || rawYoe === null
      ? null
      : Number.isFinite(Number(rawYoe))
        ? Number(rawYoe)
        : null;

  return {
    id: llmCorrelationId,
    skills: applicant.skills ? [...applicant.skills] : [],
    yearsOfExperience: yoe,
    currentJobTitle: applicant.currentJobTitle ?? '',
  };
}
