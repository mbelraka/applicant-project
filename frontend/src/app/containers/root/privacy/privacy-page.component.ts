import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PrivacyConsentDialogService } from './privacy-consent-dialog.service';
import { PrivacyConsentService } from '../../../services/privacy-consent.service';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [MatButtonModule, RouterLink, TranslateModule],
  templateUrl: './privacy-page.component.html',
  styleUrl: './privacy-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPageComponent {
  private readonly _privacy = inject(PrivacyConsentService);
  private readonly _privacyDialog = inject(PrivacyConsentDialogService);
  private readonly _translate = inject(TranslateService);

  protected openConsentEditor(): void {
    this._privacyDialog.openConsentEditor();
  }

  protected exportLocalCopy(): void {
    const payload = this._privacy.buildLocalDataExportJson();
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `recruita-local-export-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  protected eraseLocalData(): void {
    const ok = window.confirm(
      this._translate.instant('privacy.page.eraseConfirm')
    );
    if (ok) {
      this._privacy.eraseAllLocalUserDataAndReload();
    }
  }
}
