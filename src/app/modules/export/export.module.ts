import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';

import { ExportRoutingModule } from './export-routing.module';
import { ExportComponent } from './components/export/export.component';
import { SharedModule } from '../../shared/shared.module';
import { StateFeatures } from '../../containers/root/enums/state-features.enum';

@NgModule({
  declarations: [ExportComponent],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(StateFeatures.Export, {}),
    ExportRoutingModule,
  ],
})
export class ExportModule {}
