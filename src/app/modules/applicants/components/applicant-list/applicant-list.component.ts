import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectSortedApplicants } from '../../state/applicants.selectors';
import { setFilterBySkill } from '../../state/applicants.actions';

@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.scss'],
})
export class ApplicantListComponent {
  public readonly displayedColumns: string[] = [
    'name',
    'availability',
    'skills',
  ];
  public readonly applicants$ = this.store.select(selectSortedApplicants);

  public constructor(private store: Store) {}

  public filterBySkill(skill: string): void {
    this.store.dispatch(setFilterBySkill({ skill }));
  }
}
