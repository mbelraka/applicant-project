import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LocalStorageService } from './local-storage.service';
import { Languages } from '../enums/language.enum';
import { APP_CONFIG } from '../config/app.config';
import { setLanguage } from '../state/app.actions';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private readonly languageSubject: BehaviorSubject<Languages>;
  private readonly dateFormatSubject: BehaviorSubject<string>;

  constructor(
    private readonly store: Store<{ language: Languages }>,
    private readonly localStorageService: LocalStorageService
  ) {
    const languageKey = APP_CONFIG.LOCALIZATION.LANGUAGE_KEY;
    const dateFormatKey = APP_CONFIG.LOCALIZATION.DATE_FORMAT_KEY;

    // Initialize language and date format
    const storedLanguage =
      this.localStorageService.getItem<Languages>(languageKey) ||
      APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE;

    const storedDateFormat =
      APP_CONFIG.getDateFormat(storedLanguage) ||
      APP_CONFIG.getDateFormat(APP_CONFIG.LOCALIZATION.DEFAULT_LANGUAGE);

    this.languageSubject = new BehaviorSubject<Languages>(storedLanguage);
    this.dateFormatSubject = new BehaviorSubject<string>(storedDateFormat);

    // Dispatch initial language to NgRx Store
    this.store.dispatch(setLanguage({ language: storedLanguage }));

    // Subscribe to store updates to keep local storage in sync
    this.store
      .select('language')
      .pipe(filter((language): boolean => !!language))
      .subscribe((language: Languages): void => {
        this.setStoredLanguage(language);
        this.setStoredDateFormat(APP_CONFIG.getDateFormat(language));
      });
  }

  public getStoredLanguage(): BehaviorSubject<Languages> {
    return this.languageSubject;
  }

  public setStoredLanguage(language: Languages): void {
    const languageKey = APP_CONFIG.LOCALIZATION.LANGUAGE_KEY;
    this.localStorageService.setItem(languageKey, language);
    this.languageSubject.next(language);
  }

  public getStoredDateFormat(): BehaviorSubject<string> {
    return this.dateFormatSubject;
  }

  public setStoredDateFormat(dateFormat: string): void {
    const dateFormatKey = APP_CONFIG.LOCALIZATION.DATE_FORMAT_KEY;
    this.localStorageService.setItem(dateFormatKey, dateFormat);
    this.dateFormatSubject.next(dateFormat);
  }

  public get currentLocale(): string {
    const language = this.languageSubject.getValue();
    return APP_CONFIG.getLocale(language);
  }
}
