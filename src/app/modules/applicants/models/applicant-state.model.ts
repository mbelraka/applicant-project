import { EntityState } from '@ngrx/entity';

import { Applicant } from './applicant.model';
import { ViewTypes } from '../enums/view-types.enum';

export interface ApplicantState extends EntityState<Applicant> {
  loading: boolean;
  error: string | null;
  filter: string;
  sortBy: keyof Applicant | null;
  filterBySkill: string | null;
  viewType: ViewTypes;
}
