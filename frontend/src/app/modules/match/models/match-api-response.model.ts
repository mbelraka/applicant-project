import { MatchScoreItem } from './match-score-item.model';

export interface MatchApiResponse {
  scores?: MatchScoreItem[];
  results?: MatchScoreItem[];
  candidates?: MatchScoreItem[];
}
