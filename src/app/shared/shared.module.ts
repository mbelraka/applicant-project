import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatSharedModule } from 'src/app/shared/mat-shared/mat-shared.module';

import { LocaleDatePipe } from './pipes/locale-date.pipe';
import { LocaleLocationPipe } from './pipes/locale-location.pipe';
import { LocaleNumberPipe } from './pipes/locale-number.pipe';
import { LocalizedTextPipe } from './pipes/localized-text.pipe';
import { RemoteTranslatePipe } from './pipes/remote-translate.pipe';

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
  LocalizedTextPipe,
  RemoteTranslatePipe,
];

@NgModule({
  declarations: [
    LocaleDatePipe,
    LocaleNumberPipe,
    LocaleLocationPipe,
    LocalizedTextPipe,
    RemoteTranslatePipe,
  ],
  imports: SHARED_MODULES,
  exports: [
    ...SHARED_MODULES,
    LocaleDatePipe,
    LocaleNumberPipe,
    LocaleLocationPipe,
    LocalizedTextPipe,
    RemoteTranslatePipe,
  ],
  providers: SHARED_PIPES,
})
export class SharedModule {}
