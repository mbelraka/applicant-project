import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export type ApplicantSkillsVariant = 'chip' | 'filter-chip' | 'inline-link';

@Component({
  selector: 'app-applicant-skills',
  templateUrl: './applicant-skills.component.html',
  styleUrls: ['./applicant-skills.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantSkillsComponent {
  @Input() public skills: readonly string[] | null | undefined = [];

  @Input() public variant: ApplicantSkillsVariant = 'chip';

  @Output() public readonly skillSelected = new EventEmitter<string>();

  public onSkillClick(event: MouseEvent, skill: string): void {
    event.stopPropagation();
    this.skillSelected.emit(skill);
  }
}
