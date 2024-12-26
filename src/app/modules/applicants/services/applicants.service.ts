import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Applicant } from '../models/applicant.model';
import { LocalStorageService } from '../../../services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class ApplicantsService {
  private readonly storageKey: string = 'applicants';

  constructor(private readonly localStorageService: LocalStorageService) {}

  /**
   * Fetches all applicants from local storage.
   *
   * @returns {Observable<Applicant[]>} - Observable of the applicants array.
   */
  public getApplicants(): Observable<Applicant[]> {
    return of(
      this.localStorageService.getItem<Applicant[]>(this.storageKey) || []
    ).pipe(
      catchError((error) => {
        console.error('Error fetching applicants:', error);
        return throwError(
          () => new Error('Failed to load applicants from storage.')
        );
      })
    );
  }

  /**
   * Saves the provided applicants to local storage.
   *
   * @param {Applicant[]} applicants - Array of applicants to store.
   * @returns {Observable<void>} - Observable that completes when saving is done.
   */
  public setApplicants(applicants: Applicant[]): Observable<void> {
    return of(
      this.localStorageService.setItem(this.storageKey, applicants)
    ).pipe(
      catchError((error) => {
        console.error('Error saving applicants:', error);
        return throwError(
          () => new Error('Failed to save applicants to storage.')
        );
      })
    );
  }

  /**
   * Adds a new applicant to local storage.
   *
   * @param {Applicant} applicant - The new applicant to add.
   * @returns {Observable<Applicant[]>} - Observable of the updated applicants array.
   */
  public addApplicant(applicant: Applicant): Observable<Applicant[]> {
    const applicants =
      this.localStorageService.getItem<Applicant[]>(this.storageKey) || [];
    applicants.push(applicant);
    this.localStorageService.setItem(this.storageKey, applicants);
    return this.getApplicants();
  }

  /**
   * Deletes an applicant by ID from local storage.
   *
   * @param {string} id - The ID of the applicant to delete.
   * @returns {Observable<Applicant[]>} - Observable of the updated applicants array.
   */
  public deleteApplicant(id: string): Observable<Applicant[]> {
    const applicants = (
      this.localStorageService.getItem<Applicant[]>(this.storageKey) || []
    ).filter((applicant: Applicant): boolean => applicant.id !== id);
    this.localStorageService.setItem(this.storageKey, applicants);
    return this.getApplicants();
  }
}
