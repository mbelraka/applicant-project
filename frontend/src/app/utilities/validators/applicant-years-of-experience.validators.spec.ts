import { FormControl } from '@angular/forms';
import {
  APPLICANT_YEARS_OF_EXPERIENCE_MAX,
  APPLICANT_YEARS_OF_EXPERIENCE_MIN,
  applicantYearsOfExperienceValidator,
} from './applicant-years-of-experience.validators';

describe('ApplicantYearsOfExperienceValidator', () => {
  it('should return null for empty values', () => {
    expect(
      applicantYearsOfExperienceValidator(new FormControl(null))
    ).toBeNull();
    expect(
      applicantYearsOfExperienceValidator(new FormControl(undefined))
    ).toBeNull();
    expect(applicantYearsOfExperienceValidator(new FormControl(''))).toBeNull();
  });

  it('should return error for non-numeric (NaN) input', () => {
    const error = applicantYearsOfExperienceValidator(new FormControl('abc'));
    expect(error).toEqual({
      yearsOfExperienceRange: {
        min: APPLICANT_YEARS_OF_EXPERIENCE_MIN,
        max: APPLICANT_YEARS_OF_EXPERIENCE_MAX,
      },
    });
  });

  it('should return error for value below minimum', () => {
    const error = applicantYearsOfExperienceValidator(new FormControl(-1));
    expect(error).toEqual({
      yearsOfExperienceRange: {
        min: APPLICANT_YEARS_OF_EXPERIENCE_MIN,
        max: APPLICANT_YEARS_OF_EXPERIENCE_MAX,
        actual: -1,
      },
    });
  });

  it('should return error for value above maximum', () => {
    const error = applicantYearsOfExperienceValidator(new FormControl(100));
    expect(error).toEqual({
      yearsOfExperienceRange: {
        min: APPLICANT_YEARS_OF_EXPERIENCE_MIN,
        max: APPLICANT_YEARS_OF_EXPERIENCE_MAX,
        actual: 100,
      },
    });
  });

  it('should return null for valid numbers', () => {
    expect(applicantYearsOfExperienceValidator(new FormControl(0))).toBeNull();
    expect(applicantYearsOfExperienceValidator(new FormControl(5))).toBeNull();
    expect(applicantYearsOfExperienceValidator(new FormControl(80))).toBeNull();
  });
});
