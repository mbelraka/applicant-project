import { createAction, props } from '@ngrx/store';

import { Applicant } from '../models/applicant.model';
import { ApplicantActionTypes } from '../enums/applicant-action-types.enum';
import { ViewTypes } from '../enums/view-types.enum';

// Load Applicants
export const loadApplicants = createAction(ApplicantActionTypes.LoadApplicants);
export const loadApplicantsSuccess = createAction(
  ApplicantActionTypes.LoadApplicantsSuccess,
  props<{ applicants: Applicant[] }>()
);
export const loadApplicantsFailure = createAction(
  ApplicantActionTypes.LoadApplicantsFailure,
  props<{ error: string }>()
);

// Add Applicant
export const addApplicant = createAction(
  ApplicantActionTypes.AddApplicant,
  props<{ applicant: Applicant }>()
);
export const addApplicantSuccess = createAction(
  ApplicantActionTypes.AddApplicantSuccess,
  props<{ applicants: Applicant[] }>()
);
export const addApplicantFailure = createAction(
  ApplicantActionTypes.AddApplicantFailure,
  props<{ error: string }>()
);

// Delete Applicant
export const deleteApplicant = createAction(
  ApplicantActionTypes.DeleteApplicant,
  props<{ id: string }>()
);
export const deleteApplicantSuccess = createAction(
  ApplicantActionTypes.DeleteApplicantSuccess,
  props<{ applicants: Applicant[] }>()
);
export const deleteApplicantFailure = createAction(
  ApplicantActionTypes.DeleteApplicantFailure,
  props<{ error: string }>()
);

// Set Filters
export const setGlobalFilter = createAction(
  ApplicantActionTypes.SetGlobalFilter,
  props<{ filter: string }>()
);

export const setSortBy = createAction(
  ApplicantActionTypes.SetSortBy,
  props<{ sortBy: keyof Applicant }>()
);

export const setViewType = createAction(
  ApplicantActionTypes.SetViewType,
  props<{ viewType: ViewTypes }>()
);

export const setFilterBySkill = createAction(
  ApplicantActionTypes.SetFilterBySkill,
  props<{ skill: string }>()
);
