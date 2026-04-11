import { inject } from '@angular/core';
import { ActionReducer, INIT, MetaReducer, UPDATE } from '@ngrx/store';

import { FULL_STATE_STORAGE_KEY } from '../config/persistence.constants';
import { FullState } from '../models/full-state.model';
import { LocalStorageService } from '../services/local-storage.service';
import { isLanguage } from '../utilities/language.utils';
import { initialAppState } from './app.reducer';

/** Ensure persisted `app.language` is a supported enum value before rehydrating. */
function withValidAppLanguage(state: FullState): FullState {
  const lang = state.app?.language;
  if (isLanguage(lang)) {
    return state;
  }
  return {
    ...state,
    app: {
      ...initialAppState,
      ...state.app,
      language: initialAppState.language,
    },
  };
}

export function metaReducerLocalStorage(): MetaReducer<FullState> {
  return (reducer: ActionReducer<FullState>): ActionReducer<FullState> => {
    const storage = inject(LocalStorageService);

    return (state, action): FullState => {
      if (action.type === INIT || action.type === UPDATE) {
        const saved = storage.getItem<FullState>(FULL_STATE_STORAGE_KEY);
        const base = reducer(undefined, action);
        if (!saved) {
          return base;
        }
        const normalized = withValidAppLanguage(saved);
        return {
          ...base,
          ...normalized,
          app: { ...base.app, ...normalized.app },
        };
      }

      const nextState = reducer(state ?? reducer(undefined, action), action);
      // Persist full state for rehydration on the next load
      storage.setItem(FULL_STATE_STORAGE_KEY, nextState);
      return nextState;
    };
  };
}
