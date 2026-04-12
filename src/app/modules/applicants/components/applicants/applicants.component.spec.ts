import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { StateFeatures } from 'src/app/containers/root/enums/state-features.enum';
import { Languages } from 'src/app/enums/language.enum';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewTypes } from '../../enums/view-types.enum';
import { ApplicantGridComponent } from '../applicant-grid/applicant-grid.component';
import { ApplicantListComponent } from '../applicant-list/applicant-list.component';
import { ApplicantsComponent } from './applicants.component';

describe('ApplicantsComponent', () => {
  let component: ApplicantsComponent;
  let fixture: ComponentFixture<ApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ApplicantsComponent,
        ApplicantGridComponent,
        ApplicantListComponent,
      ],
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
            [StateFeatures.Applicants]: {
              ids: [],
              entities: {},
              loading: false,
              error: null,
              filter: '',
              sortBy: null,
              filterBySkill: null,
              viewType: ViewTypes.GRID,
            },
          },
        }),
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj('MatDialog', ['open']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
