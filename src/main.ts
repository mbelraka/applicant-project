import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import de from '@angular/common/locales/de';
import fr from '@angular/common/locales/fr';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Unregister service workers during development
if (!environment.production) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations): void =>
        registrations.forEach((registration) => registration.unregister())
      );
  }
}

// Enable production mode for production builds
if (environment.production) {
  enableProdMode();
}

// Bootstrap the application
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err: unknown): void => console.error(err));

registerLocaleData(en);
registerLocaleData(de);
registerLocaleData(fr);
