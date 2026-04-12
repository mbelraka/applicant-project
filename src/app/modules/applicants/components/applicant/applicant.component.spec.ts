import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Languages } from 'src/app/enums/language.enum';
import { Applicant } from '../../models/applicant.model';
import { ApplicantComponent } from './applicant.component';

describe('ApplicantComponent', () => {
  let component: ApplicantComponent;
  let fixture: ComponentFixture<ApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantComponent],
      providers: [
        provideMockStore({
          initialState: {
            app: { language: Languages.English },
          },
        }),
      ],
    })
      .overrideComponent(ApplicantComponent, {
        set: { template: '<span></span>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ApplicantComponent);
    component = fixture.componentInstance;
    component.applicant = new Applicant({
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      skills: ['Angular'],
      availableFrom: new Date(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
