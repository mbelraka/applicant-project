import { createAction, props } from '@ngrx/store';

import { AppActionTypes } from '../enums/app-action-types.enum';
import { Languages } from '../enums/language.enum';
import { AppNotification } from '../models/app-notification.model';

// Language Actions
export const setLanguage = createAction(
  AppActionTypes.SetLanguage,
  props<{ language: Languages }>()
);

export const showNotification = createAction(
  AppActionTypes.ShowNotification,
  props<{ notification: AppNotification }>()
);

export const clearNotification = createAction(AppActionTypes.ClearNotification);
