export const PRIVACY_CONSENT_STORAGE_KEY = 'app_privacy_consent_v1' as const;

/** Bump when persisted consent schema or policy materially changes (stored record shape). */
export const PRIVACY_CONSENT_VERSION = 1;

/** Shown inline in downloadable JSON exports (not localized by design — legal/audit clarity). */
export const PRIVACY_LOCAL_EXPORT_NOTE =
  'JSON export of data stored in this browser only. Does not include server logs.';

/** SPA base path after wiping local storage (Angular `base href` default). */
export const PRIVACY_POST_ERASE_APP_PATH = '/';
