import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { fadeInOutAnimation } from 'src/app/shared/animations/fade-in-out.animation';
import { ApplicantForm } from '../../models/applicanion-form.model';

@Component({
  selector: 'app-new-applicant',
  templateUrl: './new-applicant.component.html',
  styleUrls: ['./new-applicant.component.scss'],
  animations: [fadeInOutAnimation],
})
export class NewApplicantComponent {
  /** Constants for key codes */
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;

  /** Reactive form for applicant data */
  public readonly fgNewApplicant: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    availableFrom: new FormControl(null),
  });

  /** List of skills added by the user */
  public skills: string[] = [];

  public constructor(
    private readonly _dialogRef: MatDialogRef<NewApplicantComponent>
  ) {}

  /**
   * Submits the form data along with skills and closes the dialog.
   */
  public submitDataAction(): void {
    if (this.fgNewApplicant.valid) {
      const formData: ApplicantForm = {
        ...this.fgNewApplicant.value,
        skills: this.skills,
      };
      this._dialogRef.close(formData);
    }
  }

  /**
   * Closes the dialog without submitting data.
   */
  public dismissAction(): void {
    this._dialogRef.close();
  }

  /**
   * Adds a new skill to the skills array.
   *
   * @param event - The chip input event containing the skill value.
   */
  public newSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.skills.push(value);
    }

    event.chipInput!.clear();
  }

  /**
   * Removes a skill from the skills array.
   *
   * @param skill - The skill to remove.
   */
  public removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }
}
