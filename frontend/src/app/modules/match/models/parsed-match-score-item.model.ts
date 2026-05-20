import { MatchScoreItem } from './match-score-item.model';

export interface ParsedMatchScoreItem
  extends Omit<MatchScoreItem, 'id' | 'matchScore' | 'score'> {
  id: string;
  sourceIndex: number;
  matchScore: number;
}
