import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';

/** Trims whitespace, then applies required + Angular email format validation. */
export function emailFieldValidator(
  control: AbstractControl
): ValidationErrors | null {
  const trimmed = (control.value ?? '').toString().trim();
  if (!trimmed) {
    return { required: true };
  }
  return Validators.email(new FormControl(trimmed));
}
