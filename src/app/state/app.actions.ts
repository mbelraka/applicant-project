import { createAction, props } from '@ngrx/store';

import { AppActionTypes } from '../enums/app-action-types.enum';
import { Languages } from '../enums/language.enum';

// Language Actions
export const setLanguage = createAction(
  AppActionTypes.SetLanguage,
  props<{ language: Languages }>()
);
