import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';

import { SharedModule } from 'src/app/shared/shared.module';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from 'src/app/modules/main/components/main.component';
import { StateFeatures } from '../../containers/root/enums/state-features.enum';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    StoreModule.forFeature(StateFeatures.Main, {}),
  ],
})
export class MainModule {}
