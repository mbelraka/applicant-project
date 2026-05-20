import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantsComponent } from 'src/app/modules/applicants/components/applicants/applicants.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicantsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantsRoutingModule {}
