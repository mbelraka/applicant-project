import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatchCandidatesComponent } from './components/match-candidates/match-candidates.component';

const routes: Routes = [
  {
    path: '',
    component: MatchCandidatesComponent,
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
export class MatchRoutingModule {}
