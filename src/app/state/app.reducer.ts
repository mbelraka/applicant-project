import { createReducer, on } from '@ngrx/store';
import { loadLanguageSuccess, setLanguage } from './app.actions';
import { APP_CONFIG } from '../config/app.config';
import { AppState } from '../models/app-state.model';

// Initial application state
export const initialAppState: AppState = {
  language: APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE,
};

// Define the reducer properly
export const appReducer = createReducer(
  initialAppState,
  on(setLanguage, (state, { language }) => ({
    ...state,
    language,
  })),
  on(loadLanguageSuccess, (state, { language }) => ({
    ...state,
    language,
  }))
);
