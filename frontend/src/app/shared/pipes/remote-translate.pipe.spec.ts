import { ChangeDetectorRef, DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';

import { Languages } from '../../enums/language.enum';
import { RemoteTranslateService } from '../../services/remote-translate.service';
import { RemoteTranslatePipe } from './remote-translate.pipe';

describe('RemoteTranslatePipe', () => {
  let lookupKeySpy: jasmine.Spy;
  let getCachedSpy: jasmine.Spy;
  let translateSpy: jasmine.Spy;
  let markForCheckSpy: jasmine.Spy;
  let pipe: RemoteTranslatePipe;

  beforeEach(() => {
    lookupKeySpy = jasmine
      .createSpy('lookupKey')
      .and.callFake(
        (t: string | null | undefined, from: string, to: string) => {
          const text = t?.trim();
          return text ? `${from}|${to}|${text}` : null;
        }
      );
    getCachedSpy = jasmine.createSpy('getCached').and.returnValue(undefined);
    translateSpy = jasmine
      .createSpy('translate')
      .and.callFake((text: string) => of(text));
    markForCheckSpy = jasmine.createSpy('markForCheck');

    TestBed.configureTestingModule({
      providers: [
        RemoteTranslatePipe,
        provideMockStore({
          initialState: { app: { language: Languages.English } },
        }),
        {
          provide: ChangeDetectorRef,
          useValue: { markForCheck: markForCheckSpy },
        },
        {
          provide: DestroyRef,
          useValue: { onDestroy: jasmine.createSpy('onDestroy') },
        },
        {
          provide: RemoteTranslateService,
          useValue: {
            translate: translateSpy,
            getCached: getCachedSpy,
            lookupKey: lookupKeySpy,
          },
        },
      ],
    });

    pipe = TestBed.inject(RemoteTranslatePipe);
  });

  it('returns empty string for nullish and whitespace values', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('   ')).toBe('');
  });

  it('returns raw text for English language and reuses cached key', () => {
    (pipe as unknown as { _language: Languages })._language = Languages.English;

    expect(pipe.transform(' Hello ')).toBe('Hello');
    expect(pipe.transform(' Hello ')).toBe('Hello');

    expect(getCachedSpy).not.toHaveBeenCalled();
    expect(translateSpy).not.toHaveBeenCalled();
  });

  it('returns cached translation for non-English language', () => {
    (pipe as unknown as { _language: Languages })._language = Languages.German;
    getCachedSpy.and.returnValue('Hallo');

    const translated = pipe.transform('Hello');

    expect(translated).toBe('Hallo');
    expect(getCachedSpy).toHaveBeenCalledWith(
      'Hello',
      Languages.English,
      Languages.German
    );
    expect(translateSpy).not.toHaveBeenCalled();
  });

  it('returns pending marker then updates value after async translation', () => {
    (pipe as unknown as { _language: Languages })._language = Languages.French;
    const response$ = new Subject<string>();
    translateSpy.and.returnValue(response$);

    const pending = pipe.transform('Hello');
    expect(pending).toBe('…');
    expect(translateSpy).toHaveBeenCalledWith(
      'Hello',
      Languages.English,
      Languages.French
    );

    response$.next('Bonjour');
    response$.complete();

    expect(pipe.transform('Hello')).toBe('Bonjour');
    expect(markForCheckSpy).toHaveBeenCalled();
  });

  it('ignores stale async translation responses', () => {
    (pipe as unknown as { _language: Languages })._language = Languages.Italian;
    const first$ = new Subject<string>();
    const second$ = new Subject<string>();
    translateSpy.and.returnValues(first$, second$);

    expect(pipe.transform('Hello')).toBe('…');
    expect(pipe.transform('World')).toBe('…');

    first$.next('Ciao');
    first$.complete();

    expect(pipe.transform('World')).toBe('…');

    second$.next('Mondo');
    second$.complete();

    expect(pipe.transform('World')).toBe('Mondo');
  });
});
