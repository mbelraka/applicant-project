import {Component, Inject, LOCALE_ID} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { filter } from 'rxjs';

import { NewApplicantComponent } from 'src/app/modules/applicants/components/new-applicant/new-applicant.component';
import { fadeInOutAnimation } from 'src/app/shared/animations/fade-in-out.animation';
import { slideInLeftAnimation } from 'src/app/shared/animations/slide-in-left.animation';
import { newApplicant } from 'src/app/state/state.actions';
import { applicantsList } from 'src/app/state/state.selectors';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
  animations: [fadeInOutAnimation, slideInLeftAnimation],
})
export class ApplicantsComponent {
  public readonly applicantsList$ = this.store.select(applicantsList);

  public constructor(
    private readonly dialogRef: MatDialog,
    private readonly store: Store,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  public openForm(): void {
    const dialog = this.dialogRef.open(NewApplicantComponent);

    dialog
      .afterClosed()
      .pipe(filter((applicant) => Boolean(applicant)))
      .subscribe((applicant) => this.store.dispatch(newApplicant(applicant)));
  }
}
