import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppComponent } from './app.component';
import { appReducer } from './state/app.reducer';
import { metaReducerLocalStorage } from './state/meta-reducers';
import { AppEffects } from './state/app.effects';
import { LocalizationService } from './services/localization.service';
import { localeIdFactory } from './utilities/factories/locale-id.factory';
import { matDateLocaleFactory } from './utilities/factories/mat-date-locale.factory';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    // Configure the NgRx Store
    StoreModule.forRoot(
      { app: appReducer },
      {
        metaReducers: [metaReducerLocalStorage()],
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
      }
    ),
    // Register NgRx Effects
    EffectsModule.forRoot([AppEffects]),
    // Register Redux DevTools in development
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retain the last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode in production
      autoPause: true, // Pause when DevTools are not open
    }),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: localeIdFactory,
      deps: [LocalizationService],
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: matDateLocaleFactory,
      deps: [LocalizationService],
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
