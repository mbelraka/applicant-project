import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root/root.component';

@NgModule({
  declarations: [RootComponent],
  imports: [CommonModule, RootRoutingModule, SharedModule, NgOptimizedImage],
})
export class RootModule {}
