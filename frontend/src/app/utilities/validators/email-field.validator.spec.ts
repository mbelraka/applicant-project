import { FormControl } from '@angular/forms';
import { emailFieldValidator } from './email-field.validator';

describe('EmailFieldValidator', () => {
  it('should return required error for empty or whitespace-only input', () => {
    expect(emailFieldValidator(new FormControl(''))).toEqual({
      required: true,
    });
    expect(emailFieldValidator(new FormControl('   '))).toEqual({
      required: true,
    });
    expect(emailFieldValidator(new FormControl(null))).toEqual({
      required: true,
    });
    expect(emailFieldValidator(new FormControl(undefined))).toEqual({
      required: true,
    });
  });

  it('should validate format using Angular email validator', () => {
    // Angular's Validators.email returns {email: true} on error, or null on success.
    expect(emailFieldValidator(new FormControl('invalid'))).toEqual({
      email: true,
    });
    expect(emailFieldValidator(new FormControl('test@example.com'))).toBeNull();
  });
});
