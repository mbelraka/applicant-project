import { ApplicantState } from '../modules/applicants/models/applicant-state.model';
import { ExportFeatureState } from '../modules/export/models/export-state.model';
import { StateFeatures } from '../containers/root/enums/state-features.enum';
import { AppState } from './app-state.model';

export interface FullState {
  app: AppState; 
  [StateFeatures.Applicants]?: ApplicantState;
  [StateFeatures.Main]?: Record<string, never>;
  [StateFeatures.Export]?: ExportFeatureState;
}
