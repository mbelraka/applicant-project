/** Stored consent record version — bump after material privacy/policy changes require re-choice. */
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
