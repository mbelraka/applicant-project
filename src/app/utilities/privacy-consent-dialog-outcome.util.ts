import {
  PrivacyConsentDialogCloseResult,
  PrivacyConsentFormState,
} from '../models/privacy-consent.model';
import { PrivacyConsentService } from '../services/privacy-consent.service';

function isPrivacyConsentFormState(
  value: unknown
): value is PrivacyConsentFormState {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o['optionalRemoteTranslation'] === 'boolean' &&
    typeof o['optionalGeocoding'] === 'boolean' &&
    typeof o['optionalAiMatching'] === 'boolean'
  );
}

export function isPrivacyConsentDialogCloseResult(
  value: unknown
): value is PrivacyConsentDialogCloseResult {
  if (value === null || typeof value !== 'object' || !('mode' in value)) {
    return false;
  }
  const mode = (value as { mode: unknown }).mode;
  if (mode === 'necessary' || mode === 'all') {
    return true;
  }
  if (mode !== 'custom') {
    return false;
  }
  if (!('choices' in value)) {
    return false;
  }
  return isPrivacyConsentFormState((value as { choices: unknown }).choices);
}

/** Maps a dialog close payload to the corresponding {@link PrivacyConsentService} persist calls. */
export function commitPrivacyConsentDialogOutcome(
  privacy: PrivacyConsentService,
  result: unknown
): void {
  if (!isPrivacyConsentDialogCloseResult(result)) {
    return;
  }
  switch (result.mode) {
    case 'necessary':
      privacy.saveNecessaryOnly();
      return;
    case 'all':
      privacy.saveAcceptAllOptional();
      return;
    case 'custom':
      privacy.saveCustom(result.choices);
      return;
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}
