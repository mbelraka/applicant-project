import { TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { LocalizedTextPipe } from './localized-text.pipe';

describe('LocalizedTextPipe', () => {
  let pipe: LocalizedTextPipe;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [LocalizedTextPipe],
    });
    pipe = TestBed.inject(LocalizedTextPipe);
    translate = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for nullish values', () => {
    expect(pipe.transform(undefined, 'any')).toBe('');
    expect(pipe.transform(null, 'any')).toBe('');
    expect(pipe.transform('   ', 'any')).toBe('');
  });

  it('should fallback to raw value when translation key is missing', () => {
    expect(pipe.transform('Unknown Custom Title', 'jobTitles')).toBe(
      'Unknown Custom Title'
    );
  });

  it('should translate using a generic namespace', () => {
    translate.setTranslation('it', {
      labels: { engineeringManager: 'Responsabile ingegneria' },
    });
    translate.use('it');
    expect(pipe.transform('Engineering Manager', 'labels')).toBe(
      'Responsabile ingegneria'
    );
  });

  it('should normalize punctuation and casing into key segment', () => {
    translate.setTranslation('es', {
      labels: { fullStackDeveloper: 'Desarrollador full-stack' },
    });
    translate.use('es');
    expect(pipe.transform('full-stack developer', 'labels')).toBe(
      'Desarrollador full-stack'
    );
  });
});
