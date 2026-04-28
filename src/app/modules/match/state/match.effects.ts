import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  catchError,
  map,
  of,
  switchMap,
  take,
  timeout,
} from 'rxjs';

import { APP_CONFIG } from '../../../config/app.config';
import { FullState } from '../../../models/full-state.model';
import { getErrorMessage } from '../../../utilities/error.utils';
import { selectAppLanguage } from '../../../state/app.selectors';
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
      switchMap(() =>
        combineLatest([
          this._store.select(selectMatchJobDescription).pipe(take(1)),
          this._store.select(selectAllApplicants).pipe(take(1)),
          this._store.select(selectTopCandidatesCount).pipe(take(1)),
          this._store.select(selectAppLanguage).pipe(take(1)),
        ]).pipe(
          switchMap(
            ([jobDescription, applicants, topCandidatesCount, language]) =>
              this._matchCandidatesService
                .evaluate(
                  jobDescription,
                  applicants,
                  topCandidatesCount,
                  language
                )
                .pipe(
                  timeout({
                    first: APP_CONFIG.MATCH.REQUEST_TIMEOUT_MS + 1000,
                  }),
                  map((results) => evaluateCandidatesSuccess({ results })),
                  catchError((error: unknown) =>
                    of(
                      evaluateCandidatesFailure({
                        error: getErrorMessage(error),
                      })
                    )
                  )
                )
          ),
          catchError((error: unknown) =>
            of(evaluateCandidatesFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    )
  );

  public constructor(
    private readonly _actions$: Actions,
    private readonly _store: Store<FullState>,
    private readonly _matchCandidatesService: MatchCandidatesService
  ) {}
}
