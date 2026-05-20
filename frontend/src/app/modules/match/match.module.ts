import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from 'src/app/shared/shared.module';
import { StateFeatures } from 'src/app/containers/root/enums/state-features.enum';

import { MatchCandidatesComponent } from './components/match-candidates/match-candidates.component';
import { MatchRoutingModule } from './match-routing.module';
import { MatchEffects } from './state/match.effects';
import { matchReducer } from './state/match.reducer';

@NgModule({
  declarations: [MatchCandidatesComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatchRoutingModule,
    StoreModule.forFeature(StateFeatures.Match, matchReducer),
    EffectsModule.forFeature([MatchEffects]),
  ],
})
export class MatchModule {}
