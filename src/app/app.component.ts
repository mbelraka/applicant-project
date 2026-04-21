import { Component } from '@angular/core';

import { LocalizationService } from './services/localization.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: false,
})
export class AppComponent {
  /**
   * Eagerly injects `LocalizationService` so it bootstraps at app start.
   * The service syncs translations and Material date locale via its constructor.
   */
  public constructor(_localization: LocalizationService) {}
}
