import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap } from 'rxjs';

import { ExportService } from '../services/export.service';
import {
  exportApplicants,
  exportFailure,
  exportSuccess,
} from './export.actions';
import { ExportFormats } from '../enums/export-formats.enum';

@Injectable()
export class ExportEffects {
  public exportApplicants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(exportApplicants),
      switchMap(({ format }) =>
        from(this.triggerExport(format)).pipe(
          // Convert Promise to Observable
          map(() => exportSuccess()),
          catchError((error) => of(exportFailure({ error: error.message })))
        )
      )
    )
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly exportService: ExportService
  ) {}

  private async triggerExport(format: ExportFormats): Promise<void> {
    switch (format) {
      case ExportFormats.CSV:
        return this.exportService.exportAsCSV();
      case ExportFormats.JSON:
        return this.exportService.exportAsJSON();
      case ExportFormats.EXCEL:
        return this.exportService.exportAsExcel();
      case ExportFormats.PDF:
        return this.exportService.exportAsPDF();
      default:
        throw new Error('Unsupported export format');
    }
  }
}
