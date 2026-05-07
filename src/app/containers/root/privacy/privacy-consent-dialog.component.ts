import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import type { PrivacyConsentDialogCloseResult } from '../../../models/privacy-consent-dialog-close-result.model';
import type { PrivacyConsentDialogData } from '../../../models/privacy-consent-dialog-data.model';

@Component({
  selector: 'app-privacy-consent-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './privacy-consent-dialog.component.html',
  styleUrl: './privacy-consent-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyConsentDialogComponent {
  private readonly _dialogRef = inject(
    MatDialogRef<
      PrivacyConsentDialogComponent,
      PrivacyConsentDialogCloseResult | undefined
    >
  );

  private readonly _data = inject(MAT_DIALOG_DATA, {
    optional: true,
  }) as PrivacyConsentDialogData | undefined;

  protected optionalRemoteTranslation =
    this._data?.initialChoices.optionalRemoteTranslation ?? false;
  protected optionalGeocoding =
    this._data?.initialChoices.optionalGeocoding ?? false;
  protected optionalAiMatching =
    this._data?.initialChoices.optionalAiMatching ?? false;

  protected closeBeforePrivacyNav(): void {
    this._dialogRef.close();
  }

  protected toggleTranslation(change: MatCheckboxChange): void {
    this.optionalRemoteTranslation = change.checked;
  }

  protected toggleGeocoding(change: MatCheckboxChange): void {
    this.optionalGeocoding = change.checked;
  }

  protected toggleAiMatching(change: MatCheckboxChange): void {
    this.optionalAiMatching = change.checked;
  }

  protected selectNecessary(): void {
    this._dialogRef.close({ mode: 'necessary' } as const);
  }

  protected selectAllOptional(): void {
    this._dialogRef.close({ mode: 'all' } as const);
  }

  protected saveSelection(): void {
    this._dialogRef.close({
      mode: 'custom',
      choices: {
        optionalRemoteTranslation: this.optionalRemoteTranslation,
        optionalGeocoding: this.optionalGeocoding,
        optionalAiMatching: this.optionalAiMatching,
      },
    } as const);
  }
}
