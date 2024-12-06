import { LocalizationService } from '../../services/localization.service';

export function matDateLocaleFactory(
  localizationService: LocalizationService
): string {
  return localizationService.currentLocale; // Reuse for MAT_DATE_LOCALE
}
