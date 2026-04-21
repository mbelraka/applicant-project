import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MATERIAL_SYMBOLS_OUTLINED_FONT_SET } from 'src/app/utilities/initializers/material-symbols-outlined-font.initializer';
import { ConfirmDeleteApplicantDialogComponent } from './confirm-delete-applicant-dialog.component';

describe('ConfirmDeleteApplicantDialogComponent', () => {
  async function createComponent(data: {
    candidateName: string;
    jobTitle?: string;
  }): Promise<ComponentFixture<ConfirmDeleteApplicantDialogComponent>> {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDeleteApplicantDialogComponent],
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      ConfirmDeleteApplicantDialogComponent
    );
    fixture.detectChanges();
    return fixture;
  }

  it('should expose the injected dialog data and icon font set', async () => {
    const fixture = await createComponent({
      candidateName: 'Alex Morgan',
      jobTitle: 'Senior Engineer',
    });
    const component = fixture.componentInstance;

    expect(component.data).toEqual({
      candidateName: 'Alex Morgan',
      jobTitle: 'Senior Engineer',
    });
    expect(component.outlinedIconFontSet).toBe(
      MATERIAL_SYMBOLS_OUTLINED_FONT_SET
    );
  });

  it('should render the optional job title when present', async () => {
    const fixture = await createComponent({
      candidateName: 'Alex Morgan',
      jobTitle: 'Senior Engineer',
    });
    const root = fixture.nativeElement as HTMLElement;

    expect(
      root.querySelector('.confirm-delete-applicant-dialog__name')?.textContent
    ).toContain('Alex Morgan');
    expect(
      root.querySelector('.confirm-delete-applicant-dialog__job-title')
        ?.textContent
    ).toContain('Senior Engineer');
  });

  it('should hide the optional job title when it is blank', async () => {
    const fixture = await createComponent({
      candidateName: 'Alex Morgan',
      jobTitle: '   ',
    });
    const root = fixture.nativeElement as HTMLElement;

    expect(
      root.querySelector('.confirm-delete-applicant-dialog__job-title')
    ).toBeNull();
  });
});
