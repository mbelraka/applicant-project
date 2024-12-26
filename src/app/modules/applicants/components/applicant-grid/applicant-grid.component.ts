import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Applicant } from '../../models/applicant.model';

@Component({
  selector: 'app-applicant-grid',
  templateUrl: './applicant-grid.component.html',
  styleUrls: ['./applicant-grid.component.scss'],
})
export class ApplicantGridComponent {
  /** List of applicants to display in the grid. */
  @Input() applicants: Applicant[] = [];

  /** Emits the skill clicked by the user. */
  @Output() skillClicked = new EventEmitter<string>();

  /**
   * Emits the clicked skill to the parent component.
   *
   * @param skill - The skill name clicked by the user.
   */
  public onSkillClick(skill: string): void {
    this.skillClicked.emit(skill);
  }
}
