import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Applicant } from 'src/app/modules/applicants/models/applicant.model';
import { FullState } from 'src/app/models/full-state.model';
import { deleteApplicant } from '../../state/applicants.actions';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
  standalone: false,
})
export class ApplicantComponent {
  private _applicant!: Applicant;

  public get applicant(): Applicant {
    return this._applicant;
  }

  @Input() public set applicant(value: Applicant) {
    this._applicant = value;
  }

  public constructor(private readonly store: Store<FullState>) {}

  public delete(): void {
    this.store.dispatch(deleteApplicant({ id: this.applicant.id }));
  }
}
