import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import {
  addApplicant,
  addApplicantFailure,
  addApplicantSuccess,
  deleteApplicant,
  deleteApplicantFailure,
  deleteApplicantSuccess,
  loadApplicants,
  loadApplicantsFailure,
  loadApplicantsSuccess,
  setFilterBySkill,
  setGlobalFilter,
  setSortBy,
  setViewType,
} from './applicants.actions';
import { ApplicantState } from '../models/applicant-state.model';
import { Applicant } from '../models/applicant.model';
import { ViewTypes } from '../enums/view-types.enum';

// Define Entity Adapter
export const adapter: EntityAdapter<Applicant> = createEntityAdapter<Applicant>(
  {
    selectId: (applicant: Applicant) => applicant.id,
  }
);

// Initial State
export const initialApplicantState: ApplicantState = adapter.getInitialState({
  loading: false,
  error: null,
  filter: '',
  sortBy: null,
  filterBySkill: null,
  viewType: ViewTypes.GRID,
});

// Reducer Definition
export const applicantsReducer = createReducer(
  initialApplicantState,

  // Load Applicants
  on(loadApplicants, (state) => ({ ...state, loading: true, error: null })),
  on(loadApplicantsSuccess, (state, { applicants }) =>
    adapter.setAll(applicants, { ...state, loading: false })
  ),
  on(loadApplicantsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Applicant
  on(addApplicant, (state) => ({ ...state, loading: true })),
  on(addApplicantSuccess, (state, { applicants }) =>
    adapter.setAll(applicants, { ...state, loading: false })
  ),
  on(addApplicantFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Applicant
  on(deleteApplicant, (state) => ({ ...state, loading: true })),
  on(deleteApplicantSuccess, (state, { applicants }) =>
    adapter.setAll(applicants, { ...state, loading: false })
  ),
  on(deleteApplicantFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Set Global Filter
  on(setGlobalFilter, (state, { filter }) => ({ ...state, filter })),

  // Set Sort By
  on(setSortBy, (state, { sortBy }) => ({ ...state, sortBy })),

  // Set View Type
  on(setViewType, (state, { viewType }) => ({ ...state, viewType })),

  // Set Filter By Skill
  on(setFilterBySkill, (state, { skill }) => ({
    ...state,
    filterBySkill: skill,
  }))
);
