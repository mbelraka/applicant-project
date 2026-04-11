import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StateFeatures } from '../../../containers/root/enums/state-features.enum';
import { ExportFeatureState } from '../models/export-state.model';

export const selectExportState = createFeatureSelector<ExportFeatureState>(
  StateFeatures.Export
);

export const selectExportLoading = createSelector(
  selectExportState,
  (state): boolean => state.loading
);
