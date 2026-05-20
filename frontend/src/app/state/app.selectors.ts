import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppState } from '../models/app-state.model';
import { Languages } from '../enums/language.enum';

// Selectors for the `app` feature slice registered in StoreModule.forRoot
const selectAppState = createFeatureSelector<AppState>('app');

export const selectAppLanguage = createSelector(
  selectAppState,
  (state): Languages => state.language
);
