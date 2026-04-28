import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatSharedModule } from 'src/app/shared/mat-shared/mat-shared.module';
import { ApplicantSkillsComponent } from 'src/app/modules/applicants/components/applicant-skills/applicant-skills.component';
import { ApplicationStatusChipComponent } from 'src/app/modules/applicants/components/application-status-chip/application-status-chip.component';

import { ApplicantGridCardComponent } from './components/applicant-grid-card/applicant-grid-card.component';
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
    ApplicantGridCardComponent,
    ApplicantSkillsComponent,
    ApplicationStatusChipComponent,
    LocaleDatePipe,
    LocaleNumberPipe,
    LocaleLocationPipe,
    LocalizedTextPipe,
    RemoteTranslatePipe,
  ],
  imports: SHARED_MODULES,
  exports: [
    ...SHARED_MODULES,
    ApplicantGridCardComponent,
    ApplicantSkillsComponent,
    ApplicationStatusChipComponent,
    LocaleDatePipe,
    LocaleNumberPipe,
    LocaleLocationPipe,
    LocalizedTextPipe,
    RemoteTranslatePipe,
  ],
  providers: SHARED_PIPES,
})
export class SharedModule {}
