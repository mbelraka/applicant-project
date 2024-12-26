import { EntityState } from '@ngrx/entity';

import { Applicant } from './applicant.model';
import { ViewTypes } from '../enums/view-types.enum';

/**
 * Represents the state for managing applicants.
 */
export interface ApplicantState extends EntityState<Applicant> {
  /** Indicates if a loading operation is in progress. */
  loading: boolean;

  /** Stores error messages, if any. */
  error: string | null;

  /** Global text filter for applicants. */
  filter: string;

  /** Specifies the field to sort applicants by. */
  sortBy: keyof Applicant | null;

  /** Filters applicants by a specific skill. */
  filterBySkill: string | null;

  /** Determines the current view type (e.g., grid or list). */
  viewType: ViewTypes;
}
