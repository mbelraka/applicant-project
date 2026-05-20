import type { PrivacyConsentFormState } from '../models/privacy-consent-form-state.model';
import { PrivacyConsentService } from '../services/privacy-consent.service';
import { LocalStorageService } from '../services/local-storage.service';

import {
  commitPrivacyConsentDialogOutcome,
  isPrivacyConsentDialogCloseResult,
} from './privacy-consent-dialog-outcome.util';

describe('privacy-consent-dialog-outcome.util', () => {
  describe('isPrivacyConsentDialogCloseResult', () => {
    it('accepts minimal known shapes', () => {
      expect(isPrivacyConsentDialogCloseResult({ mode: 'necessary' })).toBe(
        true
      );
      expect(isPrivacyConsentDialogCloseResult({ mode: 'all' })).toBe(true);
      const choices: PrivacyConsentFormState = {
        optionalRemoteTranslation: true,
        optionalGeocoding: false,
        optionalAiMatching: true,
      };
      expect(
        isPrivacyConsentDialogCloseResult({ mode: 'custom', choices })
      ).toBeTrue();
    });

    it('rejects invalid payloads', () => {
      expect(isPrivacyConsentDialogCloseResult(undefined)).toBeFalse();
      expect(isPrivacyConsentDialogCloseResult(null)).toBeFalse();
      expect(isPrivacyConsentDialogCloseResult({})).toBeFalse();
      expect(
        isPrivacyConsentDialogCloseResult({
          mode: 'custom',
          choices: { x: true },
        })
      ).toBeFalse();
    });
  });

  describe('commitPrivacyConsentDialogOutcome', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => localStorage.clear());

    it('persist necessary / all / custom', () => {
      const svc = new PrivacyConsentService(new LocalStorageService());

      commitPrivacyConsentDialogOutcome(svc, { mode: 'necessary' });
      expect(svc.snapshot()?.optionalAiMatching).toBeFalse();

      commitPrivacyConsentDialogOutcome(svc, { mode: 'all' });
      expect(svc.snapshot()?.optionalAiMatching).toBeTrue();

      const choices: PrivacyConsentFormState = {
        optionalRemoteTranslation: false,
        optionalGeocoding: true,
        optionalAiMatching: false,
      };
      commitPrivacyConsentDialogOutcome(svc, {
        mode: 'custom',
        choices,
      });
      expect(svc.optionalGeocoding()).toBeTrue();
      expect(svc.optionalAiMatching()).toBeFalse();
    });

    it('ignores malformed results', () => {
      const svc = new PrivacyConsentService(new LocalStorageService());
      svc.saveAcceptAllOptional();
      commitPrivacyConsentDialogOutcome(svc, 'oops');
      expect(svc.snapshot()?.optionalAiMatching).toBeTrue();
    });
  });
});
