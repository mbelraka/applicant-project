import type { PrivacyConsentFormState } from './privacy-consent-form-state.model';

/** Values emitted when the privacy consent dialog closes with a decision. */
export type PrivacyConsentDialogCloseResult =
  | { readonly mode: 'necessary' }
  | { readonly mode: 'all' }
  | {
      readonly mode: 'custom';
      readonly choices: PrivacyConsentFormState;
    };
