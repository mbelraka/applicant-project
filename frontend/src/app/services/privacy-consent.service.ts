import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { APP_CONFIG } from '../config/app.config';
import {
  LOCAL_USER_DATA_STORAGE_KEYS,
  FULL_STATE_STORAGE_KEY,
  APPLICANTS_STORAGE_KEY,
} from '../constants/persistence.constants';
import {
  PRIVACY_CONSENT_STORAGE_KEY,
  PRIVACY_CONSENT_VERSION,
  PRIVACY_LOCAL_EXPORT_NOTE,
  PRIVACY_POST_ERASE_APP_PATH,
} from '../constants/privacy.constants';

import { LocalStorageService } from './local-storage.service';
import type { PrivacyConsentFormState } from '../models/privacy-consent-form-state.model';
import type { StoredPrivacyConsent } from '../models/stored-privacy-consent.model';

@Injectable({ providedIn: 'root' })
export class PrivacyConsentService {
  private static readonly _ALL_DISABLED: PrivacyConsentFormState = {
    optionalRemoteTranslation: false,
    optionalGeocoding: false,
    optionalAiMatching: false,
  };

  private static readonly _ALL_ENABLED: PrivacyConsentFormState = {
    optionalRemoteTranslation: true,
    optionalGeocoding: true,
    optionalAiMatching: true,
  };

  private readonly _consent$ = new BehaviorSubject<StoredPrivacyConsent | null>(
    null
  );

  public constructor(private readonly _storage: LocalStorageService) {
    this._consent$.next(this._readFromStorage());
  }

  public consent$(): Observable<StoredPrivacyConsent | null> {
    return this._consent$.asObservable();
  }

  public snapshot(): StoredPrivacyConsent | null {
    return this._consent$.value;
  }

  /** Completed flow and policy version is current. */
  public isConsentCompleteAndCurrent(): boolean {
    const c = this.snapshot();
    return !!c && c.complete === true && c.version === PRIVACY_CONSENT_VERSION;
  }

  public optionalRemoteTranslation(): boolean {
    return this.snapshot()?.optionalRemoteTranslation === true;
  }

  public optionalGeocoding(): boolean {
    return this.snapshot()?.optionalGeocoding === true;
  }

  public optionalAiMatching(): boolean {
    return this.snapshot()?.optionalAiMatching === true;
  }

  /** Form snapshot for dialogs (defaults when no consent on file yet). */
  public formStateFromSnapshot(): PrivacyConsentFormState {
    const c = this.snapshot();
    return {
      optionalRemoteTranslation: c?.optionalRemoteTranslation ?? false,
      optionalGeocoding: c?.optionalGeocoding ?? false,
      optionalAiMatching: c?.optionalAiMatching ?? false,
    };
  }

  public saveNecessaryOnly(): void {
    this._persistComplete(PrivacyConsentService._ALL_DISABLED);
  }

  public saveAcceptAllOptional(): void {
    this._persistComplete(PrivacyConsentService._ALL_ENABLED);
  }

  public saveCustom(choices: PrivacyConsentFormState): void {
    this._persistComplete(choices);
  }

  /** Clear consent so the gate is shown again after next choice. */
  public resetConsentDecision(): void {
    this._storage.removeItem(PRIVACY_CONSENT_STORAGE_KEY);
    this._consent$.next(null);
  }

  /** Remove locally stored applicant data, app state, preferences, and consent; reloads the app. */
  public eraseAllLocalUserDataAndReload(): void {
    for (const key of LOCAL_USER_DATA_STORAGE_KEYS) {
      this._storage.removeItem(key);
    }
    this._storage.removeItem(APP_CONFIG.LOCALIZATION.LANGUAGE_KEY);
    this._storage.removeItem(APP_CONFIG.LOCALIZATION.DATE_FORMAT_KEY);
    this._storage.removeItem(PRIVACY_CONSENT_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.location.assign(PRIVACY_POST_ERASE_APP_PATH);
    }
  }

  public buildLocalDataExportJson(): string {
    const loc = APP_CONFIG.LOCALIZATION;
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        note: PRIVACY_LOCAL_EXPORT_NOTE,
        applicants: this._storage.getItem(APPLICANTS_STORAGE_KEY),
        fullState: this._storage.getItem(FULL_STATE_STORAGE_KEY),
        language: this._storage.getItem(loc.LANGUAGE_KEY),
        dateFormat: this._storage.getItem(loc.DATE_FORMAT_KEY),
        privacyConsentVersion: this.snapshot()?.version ?? null,
      },
      null,
      APP_CONFIG.EXPORT.JSON_INDENT_SPACES
    );
  }

  private _readFromStorage(): StoredPrivacyConsent | null {
    const raw = this._storage.getItem<StoredPrivacyConsent>(
      PRIVACY_CONSENT_STORAGE_KEY
    );
    if (!raw || typeof raw !== 'object') {
      return null;
    }
    if (
      typeof raw.version !== 'number' ||
      typeof raw.optionalRemoteTranslation !== 'boolean' ||
      typeof raw.optionalGeocoding !== 'boolean' ||
      typeof raw.optionalAiMatching !== 'boolean' ||
      typeof raw.complete !== 'boolean'
    ) {
      return null;
    }
    return raw;
  }

  private _persist(record: StoredPrivacyConsent): void {
    this._storage.setItem(PRIVACY_CONSENT_STORAGE_KEY, record);
    this._consent$.next(record);
  }

  private _persistComplete(choices: PrivacyConsentFormState): void {
    this._persist({
      version: PRIVACY_CONSENT_VERSION,
      savedAtIso: new Date().toISOString(),
      complete: true,
      optionalRemoteTranslation: choices.optionalRemoteTranslation,
      optionalGeocoding: choices.optionalGeocoding,
      optionalAiMatching: choices.optionalAiMatching,
    });
  }
}
