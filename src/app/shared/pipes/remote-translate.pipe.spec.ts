import { ChangeDetectorRef, DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { Languages } from '../../enums/language.enum';
import { RemoteTranslateService } from '../../services/remote-translate.service';
import { RemoteTranslatePipe } from './remote-translate.pipe';

describe('RemoteTranslatePipe', () => {
  it('should return empty string for nullish values', () => {
    TestBed.configureTestingModule({
      providers: [
        RemoteTranslatePipe,
        provideMockStore({
          initialState: { app: { language: Languages.English } },
        }),
        {
          provide: ChangeDetectorRef,
          useValue: { markForCheck: () => void 0 },
        },
        {
          provide: DestroyRef,
          useValue: { onDestroy: jasmine.createSpy('onDestroy') },
        },
        {
          provide: RemoteTranslateService,
          useValue: {
            translate: () => ({ pipe: () => ({ subscribe: () => void 0 }) }),
            getCached: () => undefined,
            lookupKey: (
              t: string | null | undefined,
              f: string,
              to: string
            ) => {
              const s = t?.trim();
              return s ? `${f}|${to}|${s}` : null;
            },
          },
        },
      ],
    });

    const pipe = TestBed.inject(RemoteTranslatePipe);
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('   ')).toBe('');
  });
});
