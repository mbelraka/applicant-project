import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Applicant } from 'src/app/modules/applicants/models/applicant.model';
import { deleteApplicant } from 'src/app/state/state.actions';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
})
export class ApplicantComponent {
  private _applicant: Applicant;

  public get applicant(): Applicant {
    return this._applicant;
  }

  @Input() public set applicant(_applicant: Applicant) {
    this._applicant = _applicant;
  }

  public constructor(private readonly store: Store) {}

  public delete(): void {
    this.store.dispatch(deleteApplicant(this.applicant));
  }
}
