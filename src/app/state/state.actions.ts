import { createAction, props } from '@ngrx/store';
import { ROOT_CONFIG } from 'src/app/containers/root/config/root.config';
import { Applicant } from 'src/app/modules/applicants/models/applicant.model';

export const newApplicant = createAction(
  ROOT_CONFIG.actions.newApplicant,
  props<Applicant>()
);

export const deleteApplicant = createAction(
  ROOT_CONFIG.actions.deleteApplicant,
  props<Applicant>()
);
