import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ExportState } from '../models/export-state.model';

export const selectExportState = createFeatureSelector<ExportState>('export');

export const selectExportLoading = createSelector(
  selectExportState,
  (state) => state.export.loading
);
export const selectExportError = createSelector(
  selectExportState,
  (state) => state.export.error
);
