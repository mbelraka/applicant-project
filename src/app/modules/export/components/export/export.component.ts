import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { ExportFormats } from '../../enums/export-formats.enum';
import { selectExportLoading } from '../../state/export.selectors';
import { exportApplicants } from '../../state/export.actions';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss',
})
export class ExportComponent {
  public readonly loading$ = this._store.select(selectExportLoading);

  public constructor(private readonly _store: Store) {}

  public export(format: ExportFormats): void {
    this._store.dispatch(exportApplicants({ format }));
  }

  protected readonly ExportFormats = ExportFormats;
}
