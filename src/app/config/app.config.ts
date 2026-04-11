import { Languages } from '../enums/language.enum';
import { NavLink } from '../modules/main/models/nav-link.model';

export const APP_CONFIG = {
  // Navigation links for the app
  NAV_LINKS: [
    { translationKey: 'nav.main', link: '/root/main', showHeader: false },
    {
      translationKey: 'nav.applicants',
      link: '/root/applicants',
      showHeader: true,
    },
    {
      translationKey: 'nav.export',
      link: '/root/export',
      showHeader: true,
    },
  ] as const satisfies readonly NavLink[],

  // Dialog configuration for modals
  DIALOG_CONFIG: {
    autoFocus: false,
    disableClose: true,
    width: '600px',
    maxHeight: '80vh',
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
