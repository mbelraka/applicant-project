import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { NewApplicantComponent } from 'src/app/modules/applicants/components/new-applicant/new-applicant.component';
import {
  FADE_IN_OUT_BASE_CLASS,
  FADE_IN_OUT_ENTER_CLASS,
  FADE_IN_OUT_LEAVE_CLASS,
} from 'src/app/shared/animations/fade-in-out.animation';
import { Applicant } from '../../models/applicant.model';
import {
  addApplicant,
  loadApplicants,
  setGlobalFilter,
  setViewType,
} from '../../state/applicants.actions';
import {
  selectGlobalFilter,
  selectViewType,
} from '../../state/applicants.selectors';
import { APP_CONFIG } from '../../../../config/app.config';
import { FullState } from '../../../../models/full-state.model';
import { isViewType, ViewTypes } from '../../enums/view-types.enum';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
  standalone: false,
})
export class ApplicantsComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialog = inject(MatDialog);
  private readonly _store = inject(Store<FullState>);

  public readonly fade = {
    base: FADE_IN_OUT_BASE_CLASS,
    enter: FADE_IN_OUT_ENTER_CLASS,
    leave: FADE_IN_OUT_LEAVE_CLASS,
  } as const;

  public readonly viewTypes = ViewTypes;
  public readonly viewType$ = this._store.select(selectViewType);
  public readonly globalFilter$ = this._store.select(selectGlobalFilter);

  public constructor() {
    this._store.dispatch(loadApplicants());
  }

  public applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.value) {
      this._store.dispatch(setGlobalFilter({ filter: input.value }));
    } else {
      console.warn('Invalid filter input event');
    }
  }

  public toggleView(value: unknown): void {
    if (!isViewType(value)) {
      console.error(`Invalid viewType: ${String(value)}`);
      return;
    }
    this._store.dispatch(setViewType({ viewType: value }));
  }

  public openForm(): void {
    this._dialog
      .open(NewApplicantComponent, APP_CONFIG.DIALOG_CONFIG)
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((applicant: Applicant): boolean => Boolean(applicant))
      )
      .subscribe((applicant: Applicant): void => {
        this._store.dispatch(addApplicant({ applicant }));
      });
  }
}
