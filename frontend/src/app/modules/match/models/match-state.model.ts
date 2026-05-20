import { MatchCandidateResult } from './match-candidate-result.model';

export interface MatchFeatureState {
  loading: boolean;
  error: string | null;
  jobDescription: string;
  topCandidatesCount: number;
  results: MatchCandidateResult[];
}
