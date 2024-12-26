import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ExportRoutingModule } from './export-routing.module';
import { ExportComponent } from './components/export/export.component';
import { SharedModule } from '../../shared/shared.module';
import { StateFeatures } from '../../containers/root/enums/state-features.enum';
import { ExportEffects } from './state/export.effects';

@NgModule({
  declarations: [ExportComponent],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(StateFeatures.Export, {}),
    EffectsModule.forFeature([ExportEffects]),
    ExportRoutingModule,
  ],
})
export class ExportModule {}
