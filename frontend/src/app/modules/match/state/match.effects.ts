import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  Observable,
  catchError,
  combineLatest,
  switchMap,
  take,
  timeout,
} from 'rxjs';

import { NOTIFICATION_MESSAGE_KEYS } from '../../../constants/notification-message-keys';
import { APP_CONFIG } from '../../../config/app.config';
import { AppNotificationType } from '../../../enums/app-notification-type.enum';
import { FullState } from '../../../models/full-state.model';
import { selectAppLanguage } from '../../../state/app.selectors';
import { getErrorMessage } from '../../../utilities/error.utils';
import {
  concatWithErrorNotification,
  concatWithNotification,
} from '../../../utilities/notification.utils';
import { selectAllApplicants } from '../../applicants/state/applicants.selectors';
import { MatchCandidatesService } from '../services/match-candidates.service';
import {
  evaluateCandidates,
  evaluateCandidatesFailure,
  evaluateCandidatesSuccess,
} from './match.actions';
import {
  selectMatchJobDescription,
  selectTopCandidatesCount,
} from './match.selectors';

@Injectable()
export class MatchEffects {
  public readonly evaluateCandidates$ = createEffect(() =>
    this._actions$.pipe(
      ofType(evaluateCandidates),
      switchMap(() => this._evaluateAfterInputsReady$())
    )
  );

  public constructor(
    private readonly _actions$: Actions,
    private readonly _store: Store<FullState>,
    private readonly _matchCandidatesService: MatchCandidatesService
  ) {}

  private _evaluateAfterInputsReady$(): Observable<Action> {
    return combineLatest([
      this._store.select(selectMatchJobDescription).pipe(take(1)),
      this._store.select(selectAllApplicants).pipe(take(1)),
      this._store.select(selectTopCandidatesCount).pipe(take(1)),
      this._store.select(selectAppLanguage).pipe(take(1)),
    ]).pipe(
      switchMap(([jobDescription, applicants, topCandidatesCount, language]) =>
        this._matchCandidatesService
          .evaluate(jobDescription, applicants, topCandidatesCount, language)
          .pipe(
            timeout({
              first: APP_CONFIG.MATCH.REQUEST_TIMEOUT_MS + 1000,
            }),
            switchMap((results) =>
              concatWithNotification(evaluateCandidatesSuccess({ results }), {
                type: AppNotificationType.Info,
                messageKey: NOTIFICATION_MESSAGE_KEYS.matchCompleted,
                messageParams: { count: results.length },
              })
            ),
            catchError((error: unknown) => this._matchEvaluationError$(error))
          )
      ),
      catchError((error: unknown) => this._matchEvaluationError$(error))
    );
  }

  private _matchEvaluationError$(error: unknown): Observable<Action> {
    const msg = getErrorMessage(error);
    return concatWithErrorNotification(
      evaluateCandidatesFailure({ error: msg }),
      msg,
      NOTIFICATION_MESSAGE_KEYS.matchEvaluationFailed
    );
  }
}
