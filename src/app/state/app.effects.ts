import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { APP_CONFIG } from '../config/app.config';
import { LocalStorageService } from '../services/local-storage.service';
import { setLanguage } from './app.actions';

@Injectable()
export class AppEffects {
  // Effect to save the language when it changes
  public persistLanguage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setLanguage),
        tap(({ language }) => {
          this.storage.setItem(APP_CONFIG.LOCALIZATION.LANGUAGE_KEY, language);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly storage: LocalStorageService
  ) {}
}
