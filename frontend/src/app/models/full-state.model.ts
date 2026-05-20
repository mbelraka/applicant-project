import { ApplicantState } from '../modules/applicants/models/applicant-state.model';
import { MatchFeatureState } from '../modules/match/models/match-state.model';
import { ExportFeatureState } from '../modules/export/models/export-state.model';
import { StateFeatures } from '../containers/root/enums/state-features.enum';
import { AppState } from './app-state.model';

export interface FullState {
  app: AppState;
  [StateFeatures.Applicants]?: ApplicantState;
  [StateFeatures.Match]?: MatchFeatureState;
  [StateFeatures.Export]?: ExportFeatureState;
}
