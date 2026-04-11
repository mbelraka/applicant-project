import { LocalStorageService } from '../../services/local-storage.service';
import { initialAngularLocaleFactory } from './initial-angular-locale.factory';

export function localeIdFactory(storage: LocalStorageService): string {
  return initialAngularLocaleFactory(storage);
}
