import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { MatchCandidatesComponent } from './components/match-candidates/match-candidates.component';
import { MatchRoutingModule } from './match-routing.module';

@NgModule({
  declarations: [MatchCandidatesComponent],
  imports: [CommonModule, SharedModule, MatchRoutingModule],
})
export class MatchModule {}
