import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Languages } from '../enums/language.enum';
import { ExportFormats } from '../modules/export/enums/export-formats.enum';
import { NavLink } from '../modules/main/models/nav-link.model';
import { Applicant } from '../modules/applicants/models/applicant.model';

export const APP_CONFIG = {
  /** `provideHttpClient` + `withXsrfConfiguration` (Angular CSRF defaults match common backends). */
  HTTP: {
    XSRF_COOKIE_NAME: 'XSRF-TOKEN',
    XSRF_HEADER_NAME: 'X-XSRF-TOKEN',
  } as const,

  /** NgRx Store DevTools (`StoreDevtoolsModule.instrument`). */
  NGRX_DEVTOOLS: {
    /** Retain the last N states in the extension time-travel history. */
    MAX_STATE_HISTORY: 25,
  } as const,

  EXPORT: {
    FILE_NAMES: {
      [ExportFormats.CSV]: 'applicants.csv',
      [ExportFormats.JSON]: 'applicants.json',
      [ExportFormats.EXCEL]: 'applicants.xlsx',
      [ExportFormats.PDF]: 'applicants.pdf',
    } as const,
    MIME_TYPES: {
      [ExportFormats.CSV]: 'text/csv;charset=utf-8;',
      [ExportFormats.JSON]: 'application/json',
      [ExportFormats.EXCEL]:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      [ExportFormats.PDF]: 'application/pdf',
    } as const,
    JSON_INDENT_SPACES: 2,
    DEFAULT_EMPTY_VALUE: '',
    DEFAULT_MISSING_VALUE: '-',
    EXPERIENCE_SINGLE_LABEL: 'Year',
    EXPERIENCE_PLURAL_LABEL: 'Years',
    CSV: {
      DELIMITER: ',',
      EOL: '\n',
      SKILLS_DELIMITER: '; ',
      DATE_SLICE_END_INDEX: 10,
      HEADERS: [
        'id',
        'name',
        'email',
        'phone',
        'location',
        'yearsOfExperience',
        'applicationStatus',
        'currentJobTitle',
        'availableFrom',
        'skills',
        'notes',
      ] as const,
    } as const,
    EXCEL: {
      WORKSHEET_NAME: 'Applicants',
      COLUMNS: [
        { header: 'Name', key: 'name', width: 28 },
        { header: 'Job title', key: 'currentJobTitle', width: 26 },
        { header: 'Location', key: 'location', width: 22 },
        { header: 'Experience', key: 'yearsOfExperience', width: 16 },
        { header: 'Status', key: 'applicationStatus', width: 18 },
        { header: 'Email', key: 'email', width: 28 },
        { header: 'Phone', key: 'phone', width: 18 },
        { header: 'Available From', key: 'availableFrom', width: 20 },
        { header: 'Skills', key: 'skills', width: 30 },
        { header: 'Notes', key: 'notes', width: 40 },
      ] as const,
      SKILLS_DELIMITER: ', ',
    } as const,
    PDF: {
      PAGE: {
        WIDTH: 600,
        HEIGHT: 400,
      } as const,
      TITLE: 'Applicants List',
      TITLE_X: 50,
      TITLE_TOP_OFFSET: 50,
      TITLE_FONT_SIZE: 20,
      TITLE_COLOR: {
        r: 0,
        g: 0.53,
        b: 0.71,
      } as const,
      BODY_X: 50,
      BODY_TOP_OFFSET: 100,
      BODY_FONT_SIZE: 12,
      BODY_COLOR: {
        r: 0,
        g: 0,
        b: 0,
      } as const,
      ROW_STEP: 20,
      PAGE_BREAK_MIN_Y: 50,
      NOTES_PREFIX: ' | Notes: ',
      AVAILABLE_FROM_LABEL: 'Available From',
      SKILLS_LABEL: 'Skills',
      LIST_ITEM_PREFIX: '#',
      FIELD_SEPARATOR: ', ',
      LABEL_SEPARATOR: ': ',
      SKILLS_DELIMITER: ', ',
    } as const,
  } as const,

  // Navigation links for the app
  NAV_LINKS: [
    { translationKey: 'nav.main', link: '/root/main', showHeader: false },
    {
      translationKey: 'nav.applicants',
      link: '/root/applicants',
      showHeader: true,
    },
    {
      translationKey: 'nav.matchCandidates',
      link: '/root/match',
      showHeader: true,
    },
    {
      translationKey: 'nav.export',
      link: '/root/export',
      showHeader: true,
    },
  ] as const satisfies readonly NavLink[],

  MAIN_COPY_LANG_REFRESH: {
    KEYFRAME_NAME: 'main-copy-lang-refresh',
  } as const,

  // Dialog configuration for modals
  DIALOG_CONFIG: {
    autoFocus: false,
    disableClose: true,
    width: '880px',
    maxHeight: '80vh',
    restoreFocus: false,
    panelClass: 'new-applicant-dialog-panel',
  } as const,

  /** Confirm delete applicant (grid / list card). */
  CONFIRM_DELETE_APPLICANT_DIALOG: {
    width: '420px',
    maxWidth: '92vw',
    autoFocus: 'dialog',
    restoreFocus: true,
    panelClass: 'confirm-delete-applicant-dialog-panel',
  } as const,

  // Applicants module UI (see ApplicantsComponent)
  APPLICANTS: {
    /** Collapse debounce after pointer leaves the new-applicant FAB shell (ms); avoids edge flicker during resize. */
    NEW_APPLICANT_FAB_POINTER_LEAVE_MS: 120,
    /**
     * After the new-applicant dialog closes, ignore shell `mouseenter` this long (ms).
     * The overlay going away can deliver a spurious enter while the cursor never moved.
     */
    NEW_APPLICANT_FAB_SUPPRESS_POINTER_EXPAND_AFTER_DIALOG_MS: 400,
    /** `mat-chip-input` separators (comma, Enter). */
    NEW_APPLICANT_CHIP_SEPARATOR_KEYS: [ENTER, COMMA] as const,
    /** NgRx location geocode: debounce after `searchLocationSuggestions` before calling the API (ms). */
    LOCATION_SUGGESTIONS_DEBOUNCE_MS: 350,
    /** Open-Meteo geocoding API base URL (location autocomplete). */
    LOCATION_GEOCODE_SEARCH_URL:
      'https://geocoding-api.open-meteo.com/v1/search',
    /** Open-Meteo geocode query: `count` (max results). */
    LOCATION_GEOCODE_RESULT_COUNT: '10',
    /** Open-Meteo geocode query: `language` (API response language). */
    LOCATION_GEOCODE_LANGUAGE: 'en',
    /** Open-Meteo geocode query: `format` (response shape). */
    LOCATION_GEOCODE_FORMAT: 'json',
    /**
     * Applicant grid card enter animation: `delay = min(index, cap) * stepMs` so long lists don’t
     * stagger for many seconds.
     */
    GRID_CARD_ENTER_STAGGER_CAP_INDEX: 14,
    GRID_CARD_ENTER_STAGGER_STEP_MS: 44,
    /**
     * List table row enter animation: `delay = min(index, cap) * stepMs` (same idea as grid cards).
     */
    LIST_ROW_ENTER_STAGGER_CAP_INDEX: 9,
    LIST_ROW_ENTER_STAGGER_STEP_MS: 40,
    /** Rows per page in list view (grid uses dynamic columns per row). */
    LIST_ROWS_PER_PAGE: 10,
    /** New-applicant years-of-experience numeric input constraints. */
    YEARS_OF_EXPERIENCE_MIN: 0,
    YEARS_OF_EXPERIENCE_MAX: 80,
    YEARS_OF_EXPERIENCE_STEP: 0.5,
    /**
     * Grid header sort field options: `value` matches list mat-column ids
     * (`availability` maps to store `availableFrom`).
     */
    GRID_SORT_FIELD_OPTIONS: [
      { value: 'name', sortKey: 'name', labelKey: 'applicantList.name' },
      {
        value: 'currentJobTitle',
        sortKey: 'currentJobTitle',
        labelKey: 'applicantList.currentJobTitle',
      },
      {
        value: 'yearsOfExperience',
        sortKey: 'yearsOfExperience',
        labelKey: 'applicantList.yearsOfExperience',
      },
      {
        value: 'applicationStatus',
        sortKey: 'applicationStatus',
        labelKey: 'applicantList.applicationStatus',
      },
      { value: 'email', sortKey: 'email', labelKey: 'applicantList.email' },
      { value: 'phone', sortKey: 'phone', labelKey: 'applicantList.phone' },
      {
        value: 'availability',
        sortKey: 'availableFrom',
        labelKey: 'applicantList.availability',
      },
      {
        value: 'location',
        sortKey: 'location',
        labelKey: 'applicantList.location',
      },
      { value: 'skills', sortKey: 'skills', labelKey: 'applicantList.skills' },
    ] as const satisfies ReadonlyArray<{
      readonly value: string;
      readonly sortKey: keyof Applicant;
      readonly labelKey: string;
    }>,
  } as const,

  // Localization and language settings
  LOCALIZATION: {
    DEFAULT_LANGUAGE: Languages.English,
    SUPPORTED_LANGUAGES: [
      Languages.English,
      Languages.German,
      Languages.French,
    ] as const,
    DATE_FORMATS: {
      [Languages.English]: 'MM/dd/yyyy',
      [Languages.German]: 'dd.MM.yyyy',
      [Languages.French]: 'dd/MM/yyyy',
    },
    LOCALES: {
      [Languages.English]: 'en-US',
      [Languages.German]: 'de-DE',
      [Languages.French]: 'fr-FR',
    },
    // Keys for localStorage management
    LANGUAGE_KEY: 'app_language',
    DATE_FORMAT_KEY: 'app_dateFormat',
  },

  getLocale: (language: Languages): string => {
    return (
      APP_CONFIG.LOCALIZATION.LOCALES[language] ||
      APP_CONFIG.LOCALIZATION.LOCALES[APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE]
    );
  },

  getDateFormat: (language: Languages): string => {
    return (
      APP_CONFIG.LOCALIZATION.DATE_FORMATS[language] ||
      APP_CONFIG.LOCALIZATION.DATE_FORMATS[
        APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE
      ]
    );
  },
};
