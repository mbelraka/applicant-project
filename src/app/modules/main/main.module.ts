import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from 'src/app/modules/main/components/main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, MainRoutingModule, SharedModule, NgOptimizedImage],
})
export class MainModule {}
