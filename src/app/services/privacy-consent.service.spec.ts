import { APP_CONFIG } from '../config/app.config';
import { PRIVACY_CONSENT_STORAGE_KEY } from '../config/privacy.constants';
import {
  PRIVACY_CONSENT_VERSION,
  StoredPrivacyConsent,
} from '../models/privacy-consent.model';

import { LocalStorageService } from './local-storage.service';
import { PrivacyConsentService } from './privacy-consent.service';

describe('PrivacyConsentService', () => {
  let storage: LocalStorageService;
  let service: PrivacyConsentService;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageService();
    service = new PrivacyConsentService(storage);
  });

  afterEach(() => localStorage.clear());

  it('isConsentCompleteAndCurrent is false when nothing stored', () => {
    expect(service.isConsentCompleteAndCurrent()).toBeFalse();
  });

  it('formStateFromSnapshot defaults when no consent', () => {
    expect(service.formStateFromSnapshot()).toEqual({
      optionalRemoteTranslation: false,
      optionalGeocoding: false,
      optionalAiMatching: false,
    });
  });

  it('formStateFromSnapshot mirrors stored consent', () => {
    service.saveCustom({
      optionalRemoteTranslation: true,
      optionalGeocoding: false,
      optionalAiMatching: true,
    });
    expect(service.formStateFromSnapshot()).toEqual({
      optionalRemoteTranslation: true,
      optionalGeocoding: false,
      optionalAiMatching: true,
    });
  });

  it('isConsentCompleteAndCurrent requires matching version', () => {
    const stale: StoredPrivacyConsent = {
      version: 0,
      savedAtIso: '2000',
      complete: true,
      optionalRemoteTranslation: true,
      optionalGeocoding: true,
      optionalAiMatching: true,
    };
    localStorage.setItem(PRIVACY_CONSENT_STORAGE_KEY, JSON.stringify(stale));
    const next = new PrivacyConsentService(new LocalStorageService());

    expect(next.isConsentCompleteAndCurrent()).toBeFalse();
    expect(next.snapshot()?.complete).toBeTrue();
    expect(next.snapshot()?.optionalRemoteTranslation).toBeTrue();
  });

  it('saveNecessaryOnly clears optional toggles', () => {
    service.saveNecessaryOnly();
    const snap = service.snapshot();

    expect(snap?.complete).toBeTrue();
    expect(snap?.version).toBe(PRIVACY_CONSENT_VERSION);
    expect(snap?.optionalRemoteTranslation).toBeFalse();
    expect(snap?.optionalGeocoding).toBeFalse();
    expect(snap?.optionalAiMatching).toBeFalse();

    expect(service.isConsentCompleteAndCurrent()).toBeTrue();
    expect(service.optionalAiMatching()).toBeFalse();
  });

  it('saveAcceptAllOptional enables all optional flags', () => {
    service.saveAcceptAllOptional();
    expect(service.optionalAiMatching()).toBeTrue();
    expect(service.optionalGeocoding()).toBeTrue();
    expect(service.optionalRemoteTranslation()).toBeTrue();
  });

  it('saveCustom persists mixed choices', () => {
    service.saveCustom({
      optionalRemoteTranslation: true,
      optionalGeocoding: false,
      optionalAiMatching: true,
    });
    expect(service.optionalRemoteTranslation()).toBeTrue();
    expect(service.optionalGeocoding()).toBeFalse();
    expect(service.optionalAiMatching()).toBeTrue();
  });

  it('resetConsentDecision clears consent and snapshot', () => {
    service.saveNecessaryOnly();
    expect(service.snapshot()).not.toBeNull();

    service.resetConsentDecision();

    expect(service.snapshot()).toBeNull();
    expect(localStorage.getItem(PRIVACY_CONSENT_STORAGE_KEY)).toBeNull();
  });

  it('buildLocalDataExportJson includes consent version', () => {
    storage.setItem(APP_CONFIG.LOCALIZATION.LANGUAGE_KEY, 'de');
    service.saveAcceptAllOptional();
    const json = service.buildLocalDataExportJson();
    const parsed = JSON.parse(json) as { privacyConsentVersion: number };

    expect(parsed.privacyConsentVersion).toBe(PRIVACY_CONSENT_VERSION);
  });

  it('ignores malformed consent payloads in storage', () => {
    localStorage.setItem(PRIVACY_CONSENT_STORAGE_KEY, '"not-object"');

    const next = new PrivacyConsentService(new LocalStorageService());

    expect(next.snapshot()).toBeNull();
  });

  it('ignores consent objects with invalid field types', () => {
    localStorage.setItem(
      PRIVACY_CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: '1',
        savedAtIso: 'x',
        complete: true,
        optionalRemoteTranslation: true,
        optionalGeocoding: true,
        optionalAiMatching: true,
      })
    );

    const next = new PrivacyConsentService(new LocalStorageService());

    expect(next.snapshot()).toBeNull();
  });
});
