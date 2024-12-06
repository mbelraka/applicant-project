import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { fadeInOutAnimation } from 'src/app/shared/animations/fade-in-out.animation';

@Component({
  selector: 'app-new-applicant',
  templateUrl: './new-applicant.component.html',
  styleUrls: ['./new-applicant.component.scss'],
  animations: [fadeInOutAnimation],
})
export class NewApplicantComponent {
  // Constants
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly fgNewApplicant: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    availableFrom: new FormControl(),
  });

  public skills: string[] = [];

  // Public methods
  public constructor(
    private readonly dialogRef: MatDialogRef<NewApplicantComponent>
  ) {}

  public submitDataAction(): void {
    this.dialogRef.close({ ...this.fgNewApplicant.value, skills: this.skills });
  }

  public dismissAction(): void {
    this.dialogRef.close();
  }

  public newSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.skills.push(value);
    }

    event.chipInput!.clear();
  }

  public removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }
}
