import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectSortedApplicants } from '../../state/applicants.selectors';
import { setFilterBySkill } from '../../state/applicants.actions';
import { ApplicantState } from '../../models/applicant-state.model';

@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.scss'],
})
export class ApplicantListComponent {
  /** Columns to display in the list view. */
  public readonly displayedColumns: string[] = [
    'name',
    'availability',
    'skills',
  ];

  /** Observable for the sorted list of applicants. */
  public readonly applicants$ = this._store.select(selectSortedApplicants);

  public constructor(private readonly _store: Store<ApplicantState>) {}

  /**
   * Dispatches an action to filter applicants by the given skill.
   *
   * @param skill - The skill to filter by.
   */
  public filterBySkill(skill: string): void {
    this._store.dispatch(setFilterBySkill({ skill }));
  }
}
