import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { FullState } from 'src/app/models/full-state.model';
import { Applicant } from 'src/app/modules/applicants/models/applicant.model';
import { MATERIAL_SYMBOLS_OUTLINED_FONT_SET } from 'src/app/utilities/initializers/material-symbols-outlined-font.initializer';
import { confirmDeleteApplicant } from '../../utilities/confirm-delete.util';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
  standalone: false,
})
export class ApplicantComponent {
  private readonly _dialog = inject(MatDialog);

  @Input({ required: true }) public applicant!: Applicant;

  public readonly outlinedIconFontSet = MATERIAL_SYMBOLS_OUTLINED_FONT_SET;

  public constructor(private readonly _store: Store<FullState>) {}

  public confirmDelete(): void {
    confirmDeleteApplicant(this._dialog, this._store, this.applicant);
  }
}
