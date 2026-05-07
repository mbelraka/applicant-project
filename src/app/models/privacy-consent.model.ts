/** Stored consent record version — bump after material privacy/policy changes require re-choice. */
export const PRIVACY_CONSENT_VERSION = 1;

export interface StoredPrivacyConsent {
  readonly version: number;
  readonly savedAtIso: string;
  /** Whether the visitor completed one of the offered consent flows (required + optional flags stored). */
  readonly complete: boolean;
  /** MyMemory (or similar) for dynamic job-title / copy translation; sends text to a third party. */
  readonly optionalRemoteTranslation: boolean;
  /** Open-Meteo geocoding; sends city search terms and language. */
  readonly optionalGeocoding: boolean;
  /** Sends job description plus applicant payloads to your match API / model backend. */
  readonly optionalAiMatching: boolean;
}

export interface PrivacyConsentFormState {
  optionalRemoteTranslation: boolean;
  optionalGeocoding: boolean;
  optionalAiMatching: boolean;
}

/** Payload passed into {@link PrivacyConsentDialogComponent}. */
export interface PrivacyConsentDialogData {
  readonly initialChoices: PrivacyConsentFormState;
}

/** Values emitted when the privacy consent dialog closes with a decision. */
export type PrivacyConsentDialogCloseResult =
  | { readonly mode: 'necessary' }
  | { readonly mode: 'all' }
  | {
      readonly mode: 'custom';
      readonly choices: PrivacyConsentFormState;
    };
