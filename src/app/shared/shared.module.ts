import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatSharedModule } from 'src/app/shared/mat-shared/mat-shared.module';

import { LocaleDatePipe } from './pipes/locale-date.pipe';
import { LocaleLocationPipe } from './pipes/locale-location.pipe';
import { LocaleNumberPipe } from './pipes/locale-number.pipe';
import { LocalizedJobTitlePipe } from './pipes/localized-job-title.pipe';

const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  MatSharedModule,
  RouterModule,
  ReactiveFormsModule,
  TranslateModule,
];

const SHARED_PIPES = [
  DatePipe,
  LocaleDatePipe,
  LocaleNumberPipe,
  LocaleLocationPipe,
  LocalizedJobTitlePipe,
];

@NgModule({
  declarations: [
    LocaleDatePipe,
    LocaleNumberPipe,
    LocaleLocationPipe,
    LocalizedJobTitlePipe,
  ],
  imports: SHARED_MODULES,
  exports: [
    ...SHARED_MODULES,
    LocaleDatePipe,
    LocaleNumberPipe,
    LocaleLocationPipe,
    LocalizedJobTitlePipe,
  ],
  providers: SHARED_PIPES,
})
export class SharedModule {}
