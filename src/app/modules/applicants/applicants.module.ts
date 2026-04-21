import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from 'src/app/shared/shared.module';

import { StateFeatures } from '../../containers/root/enums/state-features.enum';
import { ApplicantsRoutingModule } from './applicants-routing.module';
import { ApplicantGridComponent } from './components/applicant-grid/applicant-grid.component';
import { ApplicantListComponent } from './components/applicant-list/applicant-list.component';
import { ApplicantComponent } from './components/applicant/applicant.component';
import { ApplicantSkillsComponent } from './components/applicant-skills/applicant-skills.component';
import { ApplicantsComponent } from './components/applicants/applicants.component';
import { ApplicantsPaginationComponent } from './components/applicants-pagination/applicants-pagination.component';
import { ApplicationStatusChipComponent } from './components/application-status-chip/application-status-chip.component';
import { ConfirmDeleteApplicantDialogComponent } from './components/confirm-delete-applicant-dialog/confirm-delete-applicant-dialog.component';
import { NewApplicantComponent } from './components/new-applicant/new-applicant.component';
import { ApplicantsEffects } from './state/applicants.effects';
import { applicantsReducer } from './state/applicants.reducer';
@NgModule({
  declarations: [
    ApplicantsComponent,
    ApplicantComponent,
    NewApplicantComponent,
    ApplicantGridComponent,
    ApplicantListComponent,
    ConfirmDeleteApplicantDialogComponent,
    ApplicantSkillsComponent,
    ApplicantsPaginationComponent,
    ApplicationStatusChipComponent,
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
