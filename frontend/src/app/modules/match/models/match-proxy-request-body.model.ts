import { Languages } from '../../../enums/language.enum';
import type { PrivacyPreservingCandidatePayload } from './privacy-preserving-candidate-payload.model';

/** POST body for the configured match API endpoint (see `APP_CONFIG.MATCH.GROQ`). */
export interface MatchProxyRequestBody {
  model: string;
  temperature: number;
  deterministic: boolean;
  language: Languages;
  locale: string;
  jobDescription: string;
  candidates: PrivacyPreservingCandidatePayload[];
}
