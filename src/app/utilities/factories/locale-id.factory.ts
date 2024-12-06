import { LocalizationService } from '../../services/localization.service';

export function localeIdFactory(
  localizationService: LocalizationService
): string {
  return localizationService.currentLocale;
}
