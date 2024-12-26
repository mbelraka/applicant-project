import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RootState } from '../models/root-state.model';
import { Languages } from '../../../enums/language.enum';

// Select the entire root state
export const selectRootState = createFeatureSelector<RootState>('root');
export const selectLanguage = createSelector(
  selectRootState,
  (state: RootState): Languages => state.language
);
