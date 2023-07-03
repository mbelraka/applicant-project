import { createAction, props } from '@ngrx/store';
import { ROOT_CONFIG } from 'src/app/containers/root/config/root.config';
import { Applicant } from 'src/app/modules/applicants/models/applicant.model';
import {RootActions} from "../containers/root/enums/root-actions.enum";

export const newApplicant = createAction(
  RootActions.NewApplicant,
  props<Applicant>()
);

export const deleteApplicant = createAction(
  RootActions.DeleteApplicant,
  props<Applicant>()
);
