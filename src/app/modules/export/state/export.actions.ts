// export.actions.ts
import { createAction, props } from '@ngrx/store';

import { ExportFormats } from '../enums/export-formats.enum';
import { ExportActionNames } from '../enums/export-actions.enum';

export const exportApplicants = createAction(
  ExportActionNames.EXPORT_APPLICANTS,
  props<{ format: ExportFormats }>()
);

export const exportSuccess = createAction(ExportActionNames.EXPORT_SUCCESS);

export const exportFailure = createAction(
  ExportActionNames.EXPORT_FAILURE,
  props<{ error: string }>()
);
