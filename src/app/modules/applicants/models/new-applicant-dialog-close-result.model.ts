import { Applicant } from './applicant.model';

export type NewApplicantDialogCloseResult =
  | Applicant
  | { applicant: Applicant; isUpdate: true };
