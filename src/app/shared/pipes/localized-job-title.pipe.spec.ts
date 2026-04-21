import { TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { LocalizedJobTitlePipe } from './localized-job-title.pipe';

describe('LocalizedJobTitlePipe', () => {
  let pipe: LocalizedJobTitlePipe;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [LocalizedJobTitlePipe],
    });
    pipe = TestBed.inject(LocalizedJobTitlePipe);
    translate = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for nullish values', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('   ')).toBe('');
  });

  it('should fallback to raw value when translation key is missing', () => {
    expect(pipe.transform('Unknown Custom Title')).toBe('Unknown Custom Title');
  });

  it('should translate known titles when key exists', () => {
    translate.setTranslation('it', {
      jobTitles: { engineeringManager: 'Responsabile ingegneria' },
    });
    translate.use('it');
    expect(pipe.transform('Engineering Manager')).toBe(
      'Responsabile ingegneria'
    );
  });
});
