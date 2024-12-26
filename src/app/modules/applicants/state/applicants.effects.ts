import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';

import {
  addApplicant,
  addApplicantFailure,
  addApplicantSuccess,
  deleteApplicant,
  deleteApplicantFailure,
  deleteApplicantSuccess,
  loadApplicants,
  loadApplicantsFailure,
  loadApplicantsSuccess,
} from './applicants.actions';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Applicant } from '../models/applicant.model';

@Injectable()
export class ApplicantsEffects {
  private readonly storageKey = 'applicants';

  constructor(
    private readonly actions$: Actions,
    private readonly localStorageService: LocalStorageService
  ) {}

  // Load Applicants
  loadApplicants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadApplicants),
      switchMap(() => {
        try {
          const applicants = this._readApplicants();
          return of(loadApplicantsSuccess({ applicants }));
        } catch (error) {
          return of(loadApplicantsFailure({ error: (error as Error).message }));
        }
      })
    )
  );

  // Add Applicant
  addApplicant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addApplicant),
      switchMap(({ applicant }) => {
        try {
          const applicants = this._readApplicants();
          applicants.push(applicant);
          this._writeApplicants(applicants);
          return of(addApplicantSuccess({ applicants }));
        } catch (error) {
          return of(addApplicantFailure({ error: (error as Error).message }));
        }
      })
    )
  );

  // Delete Applicant
  deleteApplicant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteApplicant),
      switchMap(({ id }) => {
        try {
          const applicants = this._readApplicants();
          const updatedApplicants = applicants.filter(
            (applicant: Applicant): boolean => applicant.id !== id
          );
          this._writeApplicants(updatedApplicants);
          return of(deleteApplicantSuccess({ applicants: updatedApplicants }));
        } catch (error) {
          return of(
            deleteApplicantFailure({ error: (error as Error).message })
          );
        }
      })
    )
  );

  // Shared helper methods for local storage operations
  private _readApplicants(): Applicant[] {
    return this.localStorageService.getItem<Applicant[]>(this.storageKey) || [];
  }

  private _writeApplicants(applicants: Applicant[]): void {
    this.localStorageService.setItem(this.storageKey, applicants);
  }
}
