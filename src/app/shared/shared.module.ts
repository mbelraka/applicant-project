import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatSharedModule } from 'src/app/shared/mat-shared/mat-shared.module';

const SHARED_MODULES = [
  CommonModule,
  FlexLayoutModule,
  FormsModule,
  MatSharedModule,
  RouterModule,
  ReactiveFormsModule,
];

const SHARED_PIPES = [DatePipe];

@NgModule({
  imports: SHARED_MODULES,
  exports: SHARED_MODULES,
  providers: SHARED_PIPES,
})
export class SharedModule {}
