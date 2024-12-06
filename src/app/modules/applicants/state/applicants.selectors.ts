import { createFeatureSelector, createSelector } from '@ngrx/store';

import { adapter } from './applicants.reducer';
import { Applicant } from '../models/applicant.model';
import { ApplicantState } from '../models/applicant-state.model';
import { StateFeatures } from '../../../containers/root/enums/state-features.enum';
import { ViewTypes } from '../enums/view-types.enum';

// Feature Selector
export const selectApplicantState = createFeatureSelector<ApplicantState>(
  StateFeatures.Applicants
);

// Entity Adapter Selectors
const { selectAll, selectEntities } = adapter.getSelectors();

// Select All Applicants
export const selectAllApplicants = createSelector(
  selectApplicantState,
  selectAll
);

// Select Applicant Entities
export const selectApplicantEntities = createSelector(
  selectApplicantState,
  selectEntities
);

// Select Loading State
export const selectLoading = createSelector(
  selectApplicantState,
  (state): boolean => state.loading
);

// Select Error State
export const selectError = createSelector(
  selectApplicantState,
  (state): string | null => state.error
);

// Select Error State
export const selectViewType = createSelector(
  selectApplicantState,
  (state): ViewTypes => state.viewType
);

// Select Global Filter
export const selectGlobalFilter = createSelector(
  selectApplicantState,
  (state): string => state.filter
);

// Select Filter by Skill
export const selectFilterBySkill = createSelector(
  selectApplicantState,
  (state): string | null => state.filterBySkill
);

// Select Sort By Field
export const selectSortBy = createSelector(
  selectApplicantState,
  (state): keyof Applicant | null => state.sortBy
);

// Filtered Applicants
export const selectFilteredApplicants = createSelector(
  selectAllApplicants,
  selectGlobalFilter,
  selectFilterBySkill,
  (applicants, globalFilter, skillFilter): Applicant[] => {
    let filteredApplicants = applicants;

    // Filter by Skill
    if (skillFilter) {
      filteredApplicants = filteredApplicants.filter((applicant) =>
        applicant.skills?.includes(skillFilter)
      );
    }

    // Apply Global Filter
    if (globalFilter) {
      filteredApplicants = filteredApplicants.filter((applicant) =>
        applicant.name.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }

    return filteredApplicants;
  }
);

// Sorted Applicants
export const selectSortedApplicants = createSelector(
  selectFilteredApplicants,
  selectSortBy,
  (filteredApplicants, sortBy): Applicant[] =>
    sortBy
      ? [...filteredApplicants].sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
      : filteredApplicants
);
