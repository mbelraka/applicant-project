import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MATERIAL_SYMBOLS_OUTLINED_FONT_SET } from '../../../../utilities/initializers/material-symbols-outlined-font.initializer';

export interface ConfirmDeleteApplicantDialogData {
  candidateName: string;
  /** Displayed under the name when present (e.g. `Applicant.currentJobTitle`). */
  jobTitle?: string;
}

@Component({
  selector: 'app-confirm-delete-applicant-dialog',
  templateUrl: './confirm-delete-applicant-dialog.component.html',
  styleUrls: ['./confirm-delete-applicant-dialog.component.scss'],
  standalone: false,
})
export class ConfirmDeleteApplicantDialogComponent {
  public readonly data =
    inject<ConfirmDeleteApplicantDialogData>(MAT_DIALOG_DATA);

  public readonly outlinedIconFontSet = MATERIAL_SYMBOLS_OUTLINED_FONT_SET;
}
