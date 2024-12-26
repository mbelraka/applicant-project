import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ApplicantState } from '../models/applicant-state.model';
import { Applicant } from '../models/applicant.model';
import { ViewTypes } from '../enums/view-types.enum';
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

// Create an Entity Adapter
export const adapter: EntityAdapter<Applicant> = createEntityAdapter<Applicant>(
  {
    selectId: (applicant: Applicant) => applicant.id, // Selector for entity ID
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

  // **Load Applicants**
  on(loadApplicants, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadApplicantsSuccess, (state, { applicants }) =>
    adapter.setAll(applicants, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(loadApplicantsFailure, (state, { error }) => {
    console.error('Failed to load applicants:', error);
    return {
      ...state,
      loading: false,
      error,
    };
  }),

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
  on(addApplicantFailure, (state, { error }) => {
    console.error('Failed to add applicant:', error);
    return {
      ...state,
      loading: false,
      error,
    };
  }),

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
  on(deleteApplicantFailure, (state, { error }) => {
    console.error('Failed to delete applicant:', error);
    return {
      ...state,
      loading: false,
      error,
    };
  }),

  // **Set Global Filter**
  on(setGlobalFilter, (state, { filter }) => ({
    ...state,
    filter,
  })),

  // **Set Sort By**
  on(setSortBy, (state, { sortBy }) => ({
    ...state,
    sortBy,
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
  }))
);
