import { createAction, props } from '@ngrx/store';
import { AppActionTypes } from '../enums/app-action-types.enum';
import { Languages } from '../enums/language.enum';

// Language Actions
export const setLanguage = createAction(
  AppActionTypes.SetLanguage,
  props<{ language: Languages }>()
);

export const loadLanguage = createAction(AppActionTypes.LoadLanguage);

export const loadLanguageSuccess = createAction(
  AppActionTypes.LoadLanguageSuccess,
  props<{ language: Languages }>() // Language successfully loaded
);

// Application Initialization
export const initializeApp = createAction(AppActionTypes.InitializeApp);
