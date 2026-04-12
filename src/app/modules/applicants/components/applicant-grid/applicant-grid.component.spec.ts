import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { Languages } from 'src/app/enums/language.enum';
import { SharedModule } from 'src/app/shared/shared.module';
import { Applicant } from '../../models/applicant.model';
import { ApplicantGridComponent } from './applicant-grid.component';

describe('ApplicantGridComponent', () => {
  let component: ApplicantGridComponent;
  let fixture: ComponentFixture<ApplicantGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantGridComponent],
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        provideMockStore({
          initialState: {
            app: { language: Languages.English },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantGridComponent);
    component = fixture.componentInstance;
    component.applicants = [
      new Applicant({
        id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
        skills: ['TS'],
        availableFrom: new Date(),
      }),
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
