import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { NewApplicantComponent } from 'src/app/modules/applicants/components/new-applicant/new-applicant.component';
import { fadeInOutAnimation } from 'src/app/shared/animations/fade-in-out.animation';
import { slideInLeftAnimation } from 'src/app/shared/animations/slide-in-left.animation';
import { Applicant } from '../../models/applicant.model';
import {
  addApplicant,
  loadApplicants,
  setGlobalFilter,
  setViewType,
} from '../../state/applicants.actions';
import {
  selectGlobalFilter,
  selectLoading,
  selectViewType,
} from '../../state/applicants.selectors';
import { APP_CONFIG } from '../../../../config/app.config';
import { ViewTypes } from '../../enums/view-types.enum';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
  animations: [fadeInOutAnimation, slideInLeftAnimation],
})
export class ApplicantsComponent implements OnInit {
  public readonly viewTypes = ViewTypes;
  public readonly viewType$ = this._store.select(selectViewType);
  public readonly loading$ = this._store.select(selectLoading);
  public readonly globalFilter$ = this._store.select(selectGlobalFilter);

  public constructor(
    private readonly _dialogRef: MatDialog,
    private readonly _store: Store
  ) {}

  public ngOnInit(): void {
    this._store.dispatch(loadApplicants());
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this._store.dispatch(setGlobalFilter({ filter: filterValue }));
  }

  public toggleView(viewType: string): void {
    if (Object.values(ViewTypes).includes(viewType as ViewTypes)) {
      this._store.dispatch(setViewType({ viewType: viewType as ViewTypes }));
    } else {
      console.error(`Invalid viewType: ${viewType}`);
    }
  }

  public openForm(): void {
    this._dialogRef
      .open(NewApplicantComponent, APP_CONFIG.DIALOG_CONFIG)
      .afterClosed()
      .pipe(filter((applicant: Applicant): boolean => Boolean(applicant)))
      .subscribe((applicant: Applicant): void =>
        this._store.dispatch(addApplicant({ applicant }))
      );
  }
}
