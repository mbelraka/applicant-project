import { ActionReducer, INIT, MetaReducer, UPDATE } from '@ngrx/store';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { FullState } from '../models/full-state.model';

export function metaReducerLocalStorage(): MetaReducer<FullState> {
  return (reducer: ActionReducer<FullState>): ActionReducer<FullState> => {
    const localStorage = inject(LocalStorageService);

    return (state, action): FullState => {
      if (action.type === INIT || action.type === UPDATE) {
        const savedState = localStorage.getItem<FullState>('fullState');
        return savedState
          ? { ...state, ...savedState }
          : state || reducer(undefined, action);
      }

      const nextState = reducer(state || reducer(undefined, action), action);

      // Persist only the `app` part of the state
      if (nextState.app.language) {
        localStorage.setItem('language', nextState.app.language); // Save language separately
      }
      localStorage.setItem('fullState', nextState);

      return nextState;
    };
  };
}
