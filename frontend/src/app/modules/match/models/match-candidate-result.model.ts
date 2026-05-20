import { Applicant } from '../../applicants/models/applicant.model';
import { MatchCandidateProfile } from './match-candidate-profile.model';

export interface MatchCandidateResult {
  applicant: Applicant;
  score: number;
  reasoning: string;
  matchingSkills: string[];
  missingSkills: string[];
  candidateProfile: MatchCandidateProfile;
  recommendation: string;
  isTopCandidate: boolean;
}
