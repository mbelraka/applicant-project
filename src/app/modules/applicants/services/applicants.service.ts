import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ObjectMapper } from 'json-object-mapper';
import { Applicant } from '../models/applicant.model';

@Injectable({ providedIn: 'root' })
export class ApplicantsService {
  private readonly storageKey: string = 'applicants';

  /**
   * Fetches all applicants from local storage, deserializes them into Applicant objects.
   *
   * @returns {Observable<Applicant[]>} - Observable of the applicants array.
   */
  public getApplicants(): Observable<Applicant[]> {
    return of(this.readFromStorage()).pipe(
      map((data): Applicant[] =>
        data.map(
          (json: unknown): Applicant =>
            ObjectMapper.deserialize(Applicant, json as Record<string, unknown>)
        )
      ),
      catchError(() =>
        throwError(
          (): Error => new Error('Failed to load applicants from storage.')
        )
      )
    );
  }

  /**
   * Saves the provided applicants to local storage.
   *
   * @param {Applicant[]} applicants - Array of applicants to store.
   * @returns {Observable<void>} - Observable that completes when saving is done.
   */
  public setApplicants(applicants: Applicant[]): Observable<void> {
    return of(this.writeToStorage(applicants)).pipe(
      catchError(() =>
        throwError(() => new Error('Failed to save applicants to storage.'))
      )
    );
  }

  /**
   * Adds a new applicant to local storage.
   *
   * @param {Applicant} applicant - The new applicant to add.
   * @returns {Observable<Applicant[]>} - Observable of the updated applicants array.
   */
  public addApplicant(applicant: Applicant): Observable<Applicant[]> {
    const applicants = this.readFromStorage();
    applicants.push(ObjectMapper.serialize(applicant));
    this.writeToStorage(applicants);
    return this.getApplicants();
  }

  /**
   * Deletes an applicant by ID from local storage.
   *
   * @param {string} id - The ID of the applicant to delete.
   * @returns {Observable<Applicant[]>} - Observable of the updated applicants array.
   */
  public deleteApplicant(id: string): Observable<Applicant[]> {
    const applicants = this.readFromStorage().filter(
      (applicant: unknown): boolean =>
        typeof applicant === 'object' &&
        applicant !== null &&
        (applicant as Record<string, unknown>)['id'] !== id
    );
    this.writeToStorage(applicants);
    return this.getApplicants();
  }

  /**
   * Reads data from local storage and parses it into a usable format.
   *
   * @returns {unknown[]} - Parsed data from local storage or an empty array if none exist.
   * @private
   */
  private readFromStorage(): unknown[] {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      return storedData ? JSON.parse(storedData) : [];
    } catch {
      return [];
    }
  }

  /**
   * Serializes and writes data to local storage.
   *
   * @param {unknown[]} data - Data to serialize and store.
   * @private
   */
  private writeToStorage(data: unknown[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch {
      // Fail silently; errors are already handled in catchError.
    }
  }
}
