import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, from, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';

import { LocalStorageService } from '../../../services/local-storage.service';
import { getErrorMessage } from '../../../utilities/error.utils';
import {
  buildDemoApplicants,
  normalizeApplicantsAgainstSeed,
} from '../../../utilities/seed/demo-applicants';
import { Applicant } from '../models/applicant.model';
import { CitySearchService } from '../services/city-search.service';
import {
  addApplicant,
  addApplicantFailure,
  addApplicantSuccess,
  updateApplicant,
  updateApplicantFailure,
  updateApplicantSuccess,
  deleteApplicant,
  deleteApplicantFailure,
  deleteApplicantSuccess,
  loadApplicants,
  loadApplicantsFailure,
  loadApplicantsSuccess,
  searchLocationSuggestions,
  searchLocationSuggestionsFailure,
  searchLocationSuggestionsSuccess,
  seedApplicants,
} from './applicants.actions';

@Injectable()
export class ApplicantsEffects {
  private readonly storageKey = 'applicants';

  constructor(
    private readonly _actions$: Actions,
    private readonly _localStorageService: LocalStorageService,
    private readonly _citySearchService: CitySearchService
  ) {}

  // Load Applicants
  loadApplicants$ = createEffect(() =>
    this._actions$.pipe(
      ofType(loadApplicants),
      switchMap(() => {
        try {
          const applicants = this._readApplicants();
          return of(loadApplicantsSuccess({ applicants }));
        } catch (error: unknown) {
          return of(loadApplicantsFailure({ error: getErrorMessage(error) }));
        }
      })
    )
  );

  searchLocationSuggestions$ = createEffect(() =>
    this._actions$.pipe(
      ofType(searchLocationSuggestions),
      switchMap(({ query, language }) =>
        this._citySearchService.searchCityLabels(query, language).pipe(
          map((suggestions) =>
            searchLocationSuggestionsSuccess({ suggestions })
          ),
          catchError(() => of(searchLocationSuggestionsFailure()))
        )
      )
    )
  );

  seedApplicants$ = createEffect(() =>
    this._actions$.pipe(
      ofType(seedApplicants),
      concatMap(() => {
        const stored = this._readApplicants();
        const storedIds = new Set(stored.map((a) => a.id));
        const missing = buildDemoApplicants().filter(
          (d) => !storedIds.has(d.id)
        );
        return from(missing).pipe(
          map((applicant) => addApplicant({ applicant }))
        );
      })
    )
  );

  // Add Applicant
  addApplicant$ = createEffect(() =>
    this._actions$.pipe(
      ofType(addApplicant),
      exhaustMap(({ applicant }) => {
        try {
          const applicants = this._readApplicants();
          applicants.push(applicant);
          this._writeApplicants(applicants);
          return of(addApplicantSuccess({ applicants }));
        } catch (error: unknown) {
          return of(addApplicantFailure({ error: getErrorMessage(error) }));
        }
      })
    )
  );

  // Update Applicant
  updateApplicant$ = createEffect(() =>
    this._actions$.pipe(
      ofType(updateApplicant),
      exhaustMap(({ applicant }) => {
        try {
          const applicants = this._readApplicants();
          const idx = applicants.findIndex((a) => a.id === applicant.id);
          if (idx < 0) {
            return of(updateApplicantFailure({ error: 'Applicant not found' }));
          }
          const next = [...applicants];
          next[idx] = applicant;
          this._writeApplicants(next);
          return of(updateApplicantSuccess({ applicants: next }));
        } catch (error: unknown) {
          return of(updateApplicantFailure({ error: getErrorMessage(error) }));
        }
      })
    )
  );

  // Delete Applicant
  deleteApplicant$ = createEffect(() =>
    this._actions$.pipe(
      ofType(deleteApplicant),
      exhaustMap(({ id }) => {
        try {
          const applicants = this._readApplicants();
          const updatedApplicants = applicants.filter(
            (applicant: Applicant): boolean => applicant.id !== id
          );
          this._writeApplicants(updatedApplicants);
          return of(deleteApplicantSuccess({ applicants: updatedApplicants }));
        } catch (error: unknown) {
          return of(deleteApplicantFailure({ error: getErrorMessage(error) }));
        }
      })
    )
  );

  // Shared helper methods for local storage operations
  private _readApplicants(): Applicant[] {
    const raw =
      this._localStorageService.getItem<Record<string, unknown>[]>(
        this.storageKey
      ) || [];
    const applicants = raw.map(
      (row: Record<string, unknown>) =>
        new Applicant(row as ConstructorParameters<typeof Applicant>[0])
    );
    const { applicants: normalized, changed } =
      normalizeApplicantsAgainstSeed(applicants);
    if (changed) {
      this._writeApplicants(normalized);
    }
    return normalized;
  }

  private _writeApplicants(applicants: Applicant[]): void {
    this._localStorageService.setItem(this.storageKey, applicants);
  }
}
