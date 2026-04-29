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
import { getErrorMessage } from '../../../utilities/error.utils';

@Injectable()
export class ExportEffects {
  public exportApplicants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(exportApplicants),
      switchMap(({ format }) =>
        from(this._triggerExport(format)).pipe(
          // Convert Promise to Observable
          map(() => exportSuccess()),
          catchError((error: unknown) =>
            of(exportFailure({ error: getErrorMessage(error) }))
          )
        )
      )
    )
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly exportService: ExportService
  ) {}

  private _getExportHandler(
    format: ExportFormats
  ): (() => Promise<void>) | null {
    const handlers: Record<ExportFormats, () => Promise<void>> = {
      [ExportFormats.CSV]: () => this.exportService.exportAsCSV(),
      [ExportFormats.JSON]: () => this.exportService.exportAsJSON(),
      [ExportFormats.EXCEL]: () => this.exportService.exportAsExcel(),
      [ExportFormats.PDF]: () => this.exportService.exportAsPDF(),
    };
    return handlers[format] ?? null;
  }

  private async _triggerExport(format: ExportFormats): Promise<void> {
    const handler = this._getExportHandler(format);
    if (!handler) {
      throw new Error('Unsupported export format');
    }
    return handler();
  }
}
