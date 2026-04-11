import { createReducer, on } from '@ngrx/store';

import { ExportFeatureState } from '../models/export-state.model';
import {
  exportApplicants,
  exportFailure,
  exportSuccess,
} from './export.actions';

export const initialExportState: ExportFeatureState = {
  loading: false,
  error: null,
};

export const exportReducer = createReducer(
  initialExportState,
  on(
    exportApplicants,
    (state): ExportFeatureState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    exportSuccess,
    (state): ExportFeatureState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(
    exportFailure,
    (state, { error }): ExportFeatureState => ({
      ...state,
      loading: false,
      error,
    })
  )
);
