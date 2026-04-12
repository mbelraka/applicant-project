import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { NewApplicantComponent } from './new-applicant.component';

describe('NewApplicantComponent', () => {
  let component: NewApplicantComponent;
  let fixture: ComponentFixture<NewApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewApplicantComponent],
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        ...provideNoopAnimations(),
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
