import type { PrivacyConsentFormState } from './privacy-consent-form-state.model';

/** Payload passed into the privacy consent dialog component. */
export interface PrivacyConsentDialogData {
  readonly initialChoices: PrivacyConsentFormState;
}
