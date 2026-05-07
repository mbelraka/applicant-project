export const FULL_STATE_STORAGE_KEY = 'fullState' as const;

/** Applicant roster persisted in {@link LocalStorageService} (feature module owns write path). */
export const APPLICANTS_STORAGE_KEY = 'applicants' as const;

/** Keys holding personal or preference data in `localStorage` (export / erasure). */
export const LOCAL_USER_DATA_STORAGE_KEYS = [
  FULL_STATE_STORAGE_KEY,
  APPLICANTS_STORAGE_KEY,
] as const;
