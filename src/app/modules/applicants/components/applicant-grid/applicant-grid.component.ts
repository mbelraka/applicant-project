import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Applicant } from '../../models/applicant.model';

@Component({
  selector: 'app-applicant-grid',
  templateUrl: './applicant-grid.component.html',
  styleUrls: ['./applicant-grid.component.scss'],
})
export class ApplicantGridComponent {
  @Input() applicants: Applicant[] | null = [];
  @Output() skillClicked = new EventEmitter<string>();

  public onSkillClick(skill: string): void {
    this.skillClicked.emit(skill);
  }
}
