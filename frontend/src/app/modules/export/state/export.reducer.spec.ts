import { ExportFeatureState } from '../models/export-state.model';
import { ExportFormats } from '../enums/export-formats.enum';
import {
  exportApplicants,
  exportFailure,
  exportSuccess,
} from './export.actions';
import { exportReducer } from './export.reducer';

describe('exportReducer', () => {
  const initialState: ExportFeatureState = {
    loading: false,
    error: null,
  };

  it('sets loading on export request', () => {
    const state = exportReducer(
      initialState,
      exportApplicants({ format: ExportFormats.CSV })
    );

    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('resets loading and error on export success', () => {
    const loadingState: ExportFeatureState = {
      loading: true,
      error: 'Old error',
    };

    const state = exportReducer(loadingState, exportSuccess());

    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('stores error on export failure', () => {
    const state = exportReducer(
      { ...initialState, loading: true },
      exportFailure({ error: 'Export failed' })
    );

    expect(state.loading).toBeFalse();
    expect(state.error).toBe('Export failed');
  });
});
