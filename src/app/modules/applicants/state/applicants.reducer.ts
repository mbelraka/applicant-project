import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ApplicantState } from '../models/applicant-state.model';
import { Applicant } from '../models/applicant.model';
import { ViewTypes } from '../enums/view-types.enum';
import {
  addApplicant,
  addApplicantFailure,
  addApplicantSuccess,
  updateApplicant,
  updateApplicantFailure,
  updateApplicantSuccess,
  deleteApplicant,
  deleteApplicantFailure,
  deleteApplicantSuccess,
  loadApplicants,
  loadApplicantsFailure,
  loadApplicantsSuccess,
  setFilterBySkill,
  setFilterByStatus,
  setFilterByCountry,
  setGlobalFilter,
  setSortBy,
  setViewType,
  searchLocationSuggestionsSuccess,
  searchLocationSuggestionsFailure,
  clearLocationSuggestions,
} from './applicants.actions';

// Create an Entity Adapter
export const adapter: EntityAdapter<Applicant> = createEntityAdapter<Applicant>(
  {
    selectId: (applicant: Applicant) => applicant.id, // Selector for entity ID
  }
);

// Initial State
const initialApplicantState: ApplicantState = adapter.getInitialState({
  loading: false,
  error: null,
  filter: '',
  sortBy: 'name',
  sortDirection: 'asc',
  filterBySkill: null,
  filterByStatus: null,
  filterByCountry: null,
  viewType: ViewTypes.GRID,
  locationSuggestions: [],
});

// Reducer Definition
export const applicantsReducer = createReducer(
  initialApplicantState,

  // **Load Applicants**
  on(loadApplicants, (state) => ({
    ...state,
    loading: true,
    error: null as ApplicantState['error'],
  })),
  on(loadApplicantsSuccess, (state, { applicants }) =>
    adapter.setAll(applicants, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(loadApplicantsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // **Add Applicant**
  on(addApplicant, (state) => ({
    ...state,
    loading: true,
  })),
  on(addApplicantSuccess, (state, { applicants }) =>
    adapter.setAll(applicants, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(addApplicantFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // **Update Applicant**
  on(updateApplicant, (state) => ({
    ...state,
    loading: true,
  })),
  on(updateApplicantSuccess, (state, { applicants }) =>
    adapter.setAll(applicants, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(updateApplicantFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // **Delete Applicant**
  on(deleteApplicant, (state) => ({
    ...state,
    loading: true,
  })),
  on(deleteApplicantSuccess, (state, { applicants }) =>
    adapter.setAll(applicants, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(deleteApplicantFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // **Set Global Filter**
  on(setGlobalFilter, (state, { filter }) => ({
    ...state,
    filter,
  })),

  // **Set Sort By**
  on(setSortBy, (state, { sortBy, sortDirection = 'asc' }) => ({
    ...state,
    sortBy,
    sortDirection: sortBy == null ? 'asc' : sortDirection,
  })),

  // **Set View Type**
  on(setViewType, (state, { viewType }) => ({
    ...state,
    viewType,
  })),

  // **Set Filter By Skill**
  on(setFilterBySkill, (state, { skill }) => ({
    ...state,
    filterBySkill: skill,
  })),

  on(setFilterByStatus, (state, { status }) => ({
    ...state,
    filterByStatus: status,
  })),

  on(setFilterByCountry, (state, { country }) => ({
    ...state,
    filterByCountry: country,
  })),

  on(searchLocationSuggestionsSuccess, (state, { suggestions }) => ({
    ...state,
    locationSuggestions: suggestions,
  })),
  on(searchLocationSuggestionsFailure, (state) => ({
    ...state,
    locationSuggestions: [] as string[],
  })),
  on(clearLocationSuggestions, (state) => ({
    ...state,
    locationSuggestions: [] as string[],
  }))
);
