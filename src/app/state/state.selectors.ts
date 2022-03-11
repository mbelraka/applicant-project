import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Applicant } from 'src/app/modules/applicants/models/applicant.model';

export const applicantsList = createSelector(
  createFeatureSelector('applicants'),
  (state: Applicant[]): Applicant[] => state
);
