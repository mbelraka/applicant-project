import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { ApplicantListComponent } from './applicant-list.component';

describe('ApplicantListComponent', () => {
  let component: ApplicantListComponent;
  let fixture: ComponentFixture<ApplicantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantListComponent],
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
