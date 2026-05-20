import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MATERIAL_SYMBOLS_OUTLINED_FONT_SET } from 'src/app/utilities/initializers/material-symbols-outlined-font.initializer';

@Component({
  selector: 'app-applicants-pagination',
  templateUrl: './applicants-pagination.component.html',
  styleUrls: ['./applicants-pagination.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantsPaginationComponent {
  @Input() public pageCount = 1;

  @Input() public pageIndex = 0;

  @Input() public pageNumbers: readonly number[] = [];

  @Output() public readonly pageChange = new EventEmitter<number>();

  public readonly outlinedIconFontSet = MATERIAL_SYMBOLS_OUTLINED_FONT_SET;

  public goToPreviousPage(): void {
    this.goToPage(this.pageIndex - 1);
  }

  public goToNextPage(): void {
    this.goToPage(this.pageIndex + 1);
  }

  public goToPage(index: number): void {
    if (index < 0 || index >= this.pageCount) {
      return;
    }

    this.pageChange.emit(index);
  }
}
