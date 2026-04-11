import { LocalStorageService } from '../../services/local-storage.service';
import { initialAngularLocaleFactory } from './initial-angular-locale.factory';

export function matDateLocaleFactory(storage: LocalStorageService): string {
  return initialAngularLocaleFactory(storage); // Reuse for MAT_DATE_LOCALE
}
