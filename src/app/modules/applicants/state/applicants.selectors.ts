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

// Select View Type
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

// Helper Functions
const applyFilters = (
  applicants: Applicant[],
  globalFilter: string,
  skillFilter: string | null
): Applicant[] => {
  let filtered = applicants;
  if (skillFilter) {
    filtered = filtered.filter((applicant: Applicant): boolean =>
      applicant.skills?.includes(skillFilter)
    );
  }
  if (globalFilter) {
    filtered = filtered.filter((applicant: Applicant): boolean =>
      applicant.name.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }
  return filtered;
};

const applySorting = (
  applicants: Applicant[],
  sortBy: keyof Applicant | null
): Applicant[] => {
  return sortBy
    ? [...applicants].sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    : applicants;
};

// Filtered Applicants
export const selectFilteredApplicants = createSelector(
  selectAllApplicants,
  selectGlobalFilter,
  selectFilterBySkill,
  (applicants, globalFilter, skillFilter): Applicant[] =>
    applyFilters(applicants, globalFilter, skillFilter)
);

// Sorted Applicants
export const selectSortedApplicants = createSelector(
  selectFilteredApplicants,
  selectSortBy,
  (filteredApplicants, sortBy): Applicant[] =>
    applySorting(filteredApplicants, sortBy)
);
