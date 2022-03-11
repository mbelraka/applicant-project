import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from 'src/app/shared/shared.module';
import {
  metaReducerLocalStorage,
  stateReducer,
} from 'src/app/state/state.reduce';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root/root.component';

@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    RootRoutingModule,
    SharedModule,
    StoreModule.forRoot(
      { applicants: stateReducer },
      { metaReducers: [metaReducerLocalStorage] }
    ),
  ],
})
export class RootModule {}
