import { ValidatorFn, Validators } from '@angular/forms';

import { APPLICANT_PHONE_PATTERN } from '../RegEx';

export const applicantPhonePatternValidator: ValidatorFn = Validators.pattern(
  APPLICANT_PHONE_PATTERN
);
