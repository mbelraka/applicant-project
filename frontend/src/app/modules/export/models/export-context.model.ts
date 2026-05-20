import { Languages } from '../../../enums/language.enum';
import { Applicant } from '../../applicants/models/applicant.model';

export interface ExportContext {
  applicants: Applicant[];
  language: Languages;
}
