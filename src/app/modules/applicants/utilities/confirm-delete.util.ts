import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

import { APP_CONFIG } from '../../../config/app.config';
import { FullState } from '../../../models/full-state.model';
import { ConfirmDeleteApplicantDialogComponent } from '../components/confirm-delete-applicant-dialog/confirm-delete-applicant-dialog.component';
import { Applicant } from '../models/applicant.model';
import { deleteApplicant } from '../state/applicants.actions';

/**
 * Opens the confirm-delete dialog for the given applicant.
 * On confirmation, dispatches `deleteApplicant` to the store.
 */
export function confirmDeleteApplicant(
  dialog: MatDialog,
  store: Store<FullState>,
  applicant: Applicant
): void {
  dialog
    .open(ConfirmDeleteApplicantDialogComponent, {
      ...APP_CONFIG.CONFIRM_DELETE_APPLICANT_DIALOG,
      data: {
        candidateName: applicant.name?.trim() || '—',
        jobTitle: applicant.currentJobTitle?.trim() || undefined,
      },
    })
    .afterClosed()
    .pipe(
      take(1),
      filter((confirmed): confirmed is true => confirmed === true)
    )
    .subscribe((): void => {
      store.dispatch(deleteApplicant({ id: applicant.id }));
    });
}
