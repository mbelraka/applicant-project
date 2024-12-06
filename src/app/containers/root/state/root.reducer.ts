import { createReducer, on } from '@ngrx/store';
import { Languages } from '../../../enums/language.enum';
import { RootState } from '../models/root-state.model';
import { loadLanguageSuccess, setLanguage } from '../../../state/app.actions';

export const initialRootState: RootState = {
  language: Languages.English, // Default language
};

export const rootReducer = createReducer(
  initialRootState,
  on(loadLanguageSuccess, (state, { language }) => ({
    ...state,
    language,
  })), // Set language on load
  on(setLanguage, (state, { language }) => ({ ...state, language }))
);
