import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppComponent } from './app.component';
import { Languages } from './enums/language.enum';
import { appReducer } from './state/app.reducer';
import { metaReducerLocalStorage } from './state/meta-reducers';
import { AppEffects } from './state/app.effects';
import { localeIdFactory } from './utilities/factories/locale-id.factory';
import { matDateLocaleFactory } from './utilities/factories/mat-date-locale.factory';
import { AuthInterceptor } from './core/http/auth.interceptor';
import { LocalStorageService } from './services/local-storage.service';
import { environment } from '../environments/environment';

export function translateHttpLoaderFactory(
  http: HttpClient
): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: Languages.English,
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    AppRoutingModule,
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
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useFactory: localeIdFactory,
      deps: [LocalStorageService],
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: matDateLocaleFactory,
      deps: [LocalStorageService],
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
