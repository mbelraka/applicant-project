import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectGlobalFilter,
  selectSortedApplicants,
} from '../../state/applicants.selectors';
import {
  setFilterBySkill,
  setGlobalFilter,
} from '../../state/applicants.actions';

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
  public readonly globalFilter$ = this.store.select(selectGlobalFilter);

  public constructor(private store: Store) {}

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.store.dispatch(setGlobalFilter({ filter: filterValue }));
  }

  public filterBySkill(skill: string): void {
    this.store.dispatch(setFilterBySkill({ skill }));
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
