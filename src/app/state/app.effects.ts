import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { loadLanguage, loadLanguageSuccess, setLanguage } from './app.actions';
import { LocalStorageService } from '../services/local-storage.service';
import { APP_CONFIG } from '../config/app.config';
import { Languages } from '../enums/language.enum';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private localStorage: LocalStorageService
  ) {}

  // Effect to load the language during app initialization
  loadLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLanguage),
      map(() => {
        const savedLanguage =
          this.localStorage.getItem<Languages>(
            APP_CONFIG.LOCALIZATION.LANGUAGE_KEY
          ) || APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE;

        return loadLanguageSuccess({ language: savedLanguage });
      })
    )
  );

  // Effect to save the language when it changes
  setLanguage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setLanguage),
        tap(({ language }) => {
          this.localStorage.setItem(
            APP_CONFIG.LOCALIZATION.LANGUAGE_KEY,
            language
          );
        })
      ),
    { dispatch: false }
  );
}
