import { createReducer, on } from '@ngrx/store';

import { APP_CONFIG } from '../config/app.config';
import { AppState } from '../models/app-state.model';
import {
  clearNotification,
  setLanguage,
  showNotification,
} from './app.actions';

// Initial application state
export const initialAppState: AppState = {
  language: APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE,
  notification: null,
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
  ),
  on(
    showNotification,
    (state, { notification }): AppState => ({
      ...state,
      notification,
    })
  ),
  on(
    clearNotification,
    (state): AppState => ({
      ...state,
      notification: null,
    })
  )
);
