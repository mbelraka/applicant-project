import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import { APP_CONFIG } from '../config/app.config';
import { LocalStorageService } from '../services/local-storage.service';
import { NotificationSnackBarComponent } from '../components/notification-snack-bar/notification-snack-bar.component';
import { notificationPanelClasses } from '../utilities/notification.utils';
import {
  clearNotification,
  setLanguage,
  showNotification,
} from './app.actions';

@Injectable()
export class AppEffects {
  // Effect to save the language when it changes
  public persistLanguage$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(setLanguage),
        tap(({ language }) => {
          this._storage.setItem(APP_CONFIG.LOCALIZATION.LANGUAGE_KEY, language);
        })
      ),
    { dispatch: false }
  );

  /** Opens the snackbar and clears notification state; one subscription per notification. */
  public showNotification$ = createEffect(() =>
    this._actions$.pipe(
      ofType(showNotification),
      tap(({ notification }) => {
        const { durationMs, ...snackBarData } = notification;
        const snack = APP_CONFIG.NOTIFICATION.SNACKBAR;
        this._snackBar.openFromComponent(NotificationSnackBarComponent, {
          data: snackBarData,
          duration: durationMs ?? snack.DEFAULT_DURATION_MS,
          horizontalPosition: snack.HORIZONTAL_POSITION,
          verticalPosition: snack.VERTICAL_POSITION,
          panelClass: notificationPanelClasses(notification.type),
        });
      }),
      map(() => clearNotification())
    )
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _storage: LocalStorageService,
    private readonly _snackBar: MatSnackBar
  ) {}
}
