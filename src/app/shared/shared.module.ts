import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatSharedModule } from 'src/app/shared/mat-shared/mat-shared.module';

import { LocaleDatePipe } from './pipes/locale-date.pipe';
import { LocaleNumberPipe } from './pipes/locale-number.pipe';

const SHARED_MODULES = [
  CommonModule,
  FlexLayoutModule,
  FormsModule,
  MatSharedModule,
  RouterModule,
  ReactiveFormsModule,
  TranslateModule,
];

const SHARED_PIPES = [DatePipe, LocaleDatePipe, LocaleNumberPipe];

@NgModule({
  declarations: [LocaleDatePipe, LocaleNumberPipe],
  imports: SHARED_MODULES,
  exports: [...SHARED_MODULES, LocaleDatePipe, LocaleNumberPipe],
  providers: SHARED_PIPES,
})
export class SharedModule {}
