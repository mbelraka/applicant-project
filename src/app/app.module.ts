import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { ROOT_CONFIG } from 'src/app/containers/root/config/root.config';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppComponent } from './app.component';

registerLocaleData(localeDe, 'de');

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LOCALE_ID, useValue: ROOT_CONFIG.LOCALE },
    { provide: MAT_DATE_LOCALE, useValue: ROOT_CONFIG.LOCALE },
  ],
})
export class AppModule {}
