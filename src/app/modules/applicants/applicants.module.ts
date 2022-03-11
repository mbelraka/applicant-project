import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE} from '@angular/material/core';


import { SharedModule } from 'src/app/shared/shared.module';

import { ApplicantsRoutingModule } from './applicants-routing.module';
import { ApplicantsComponent } from './components/applicants/applicants.component';
import { ApplicantComponent } from './components/applicant/applicant.component';
import { NewApplicantComponent } from './components/new-applicant/new-applicant.component';

@NgModule({
  declarations: [ApplicantsComponent, ApplicantComponent, NewApplicantComponent],
  imports: [CommonModule, ApplicantsRoutingModule, SharedModule, ReactiveFormsModule],
  providers: [{ provide: LOCALE_ID, useValue: "de-DE" }, { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }]
})
export class ApplicantsModule {}
