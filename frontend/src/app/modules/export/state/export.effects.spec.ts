import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, firstValueFrom } from 'rxjs';

import { ExportService } from '../services/export.service';
import { ExportFormats } from '../enums/export-formats.enum';
import {
  exportApplicants,
  exportFailure,
  exportSuccess,
} from './export.actions';
import { ExportEffects } from './export.effects';

describe('ExportEffects', () => {
  let actions$: ReplaySubject<ReturnType<typeof exportApplicants>>;
  let effects: ExportEffects;
  let exportService: jasmine.SpyObj<ExportService>;

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
    exportService = jasmine.createSpyObj<ExportService>('ExportService', [
      'exportAsCSV',
      'exportAsJSON',
      'exportAsExcel',
      'exportAsPDF',
    ]);

    exportService.exportAsCSV.and.resolveTo();
    exportService.exportAsJSON.and.resolveTo();
    exportService.exportAsExcel.and.resolveTo();
    exportService.exportAsPDF.and.resolveTo();

    TestBed.configureTestingModule({
      providers: [
        ExportEffects,
        provideMockActions(() => actions$),
        { provide: ExportService, useValue: exportService },
      ],
    });

    effects = TestBed.inject(ExportEffects);
  });

  it('dispatches exportSuccess for successful CSV export', async () => {
    actions$.next(exportApplicants({ format: ExportFormats.CSV }));

    const action = await firstValueFrom(effects.exportApplicants$);

    expect(exportService.exportAsCSV).toHaveBeenCalled();
    expect(action).toEqual(exportSuccess());
  });

  it('dispatches exportFailure when export throws', async () => {
    exportService.exportAsPDF.and.rejectWith(new Error('PDF failure'));
    actions$.next(exportApplicants({ format: ExportFormats.PDF }));

    const action = await firstValueFrom(effects.exportApplicants$);

    expect(exportService.exportAsPDF).toHaveBeenCalled();
    expect(action).toEqual(exportFailure({ error: 'PDF failure' }));
  });
});
