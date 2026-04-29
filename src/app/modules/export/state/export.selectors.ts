import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StateFeatures } from '../../../containers/root/enums/state-features.enum';
import { ExportFeatureState } from '../models/export-state.model';

const selectExportState = createFeatureSelector<ExportFeatureState>(
  StateFeatures.Export
);

const initialExportState: ExportFeatureState = {
  loading: false,
  error: null,
};

export const selectExportLoading = createSelector(
  selectExportState,
  (state): boolean => (state ?? initialExportState).loading
);
