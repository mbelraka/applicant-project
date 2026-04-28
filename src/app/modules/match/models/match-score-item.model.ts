export interface MatchScoreItem {
  id?: string | number;
  candidateId?: string | number;
  applicantId?: string | number;
  name?: string;
  candidateName?: string;
  applicantName?: string;
  matchScore?: number | string;
  score?: number | string;
  overallScore?: number | string;
  totalScore?: number | string;
  matchingScore?: number | string;
  matchingSkills?: string[];
  missingSkills?: string[];
  candidateProfile?: {
    skills?: string[];
    yearsExperience?: number;
    topJobTitles?: string[];
    education?: string;
  };
  recommendation?: string;
  reasoning?: string;
}
