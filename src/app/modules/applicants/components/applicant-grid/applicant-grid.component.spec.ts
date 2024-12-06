import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantGridComponent } from './applicant-grid.component';

describe('ApplicantGridComponent', () => {
  let component: ApplicantGridComponent;
  let fixture: ComponentFixture<ApplicantGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
