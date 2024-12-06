import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'src/app/shared/shared.module';

import { ApplicantsRoutingModule } from './applicants-routing.module';
import { ApplicantsComponent } from './components/applicants/applicants.component';
import { ApplicantComponent } from './components/applicant/applicant.component';
import { NewApplicantComponent } from './components/new-applicant/new-applicant.component';
import { applicantsReducer } from './state/applicants.reducer';
import { ApplicantsEffects } from './state/applicants.effects';
import { StateFeatures } from '../../containers/root/enums/state-features.enum';
import { ApplicantGridComponent } from './components/applicant-grid/applicant-grid.component';
import { ApplicantListComponent } from './components/applicant-list/applicant-list.component';

@NgModule({
  declarations: [
    ApplicantsComponent,
    ApplicantComponent,
    NewApplicantComponent,
    ApplicantGridComponent,
    ApplicantListComponent,
  ],
  imports: [
    CommonModule,
    ApplicantsRoutingModule,
    SharedModule,
    StoreModule.forFeature(StateFeatures.Applicants, applicantsReducer),
    EffectsModule.forFeature([ApplicantsEffects]),
  ],
})
export class ApplicantsModule {}
