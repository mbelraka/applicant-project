import { APP_CONFIG } from '../../config/app.config';
import { Languages } from '../../enums/language.enum';
import { LocalStorageService } from '../../services/local-storage.service';
import { isLanguage } from '../language.utils';

/**
 * Bootstrap `LOCALE_ID` / `MAT_DATE_LOCALE` from persisted `Languages` enum value.
 * Runtime changes: `LocalizationService` + `DateAdapter.setLocale` + `TranslateService.use`.
 */
export function initialAngularLocaleFactory(
  storage: LocalStorageService
): string {
  const stored = storage.getItem<Languages>(
    APP_CONFIG.LOCALIZATION.LANGUAGE_KEY
  );
  const language = isLanguage(stored)
    ? stored
    : APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE;
  return APP_CONFIG.getLocale(language);
}
