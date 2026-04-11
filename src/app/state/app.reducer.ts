import { createReducer, on } from '@ngrx/store';

import { APP_CONFIG } from '../config/app.config';
import { AppState } from '../models/app-state.model';
import { setLanguage } from './app.actions';

// Initial application state
export const initialAppState: AppState = {
  language: APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE,
};

// Define the reducer properly
export const appReducer = createReducer(
  initialAppState,
  on(
    setLanguage,
    (state, { language }): AppState => ({
      ...state,
      language,
    })
  )
);
