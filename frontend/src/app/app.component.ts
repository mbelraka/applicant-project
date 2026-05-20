import { afterNextRender, Component, inject, Injector } from '@angular/core';

import { LocalizationService } from './services/localization.service';
import { appendSnackBarMotionStyleElement } from './utilities/snack-bar-motion';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: false,
})
export class AppComponent {
  private readonly _injector = inject(Injector);

  /**
   * Eagerly injects `LocalizationService` so it bootstraps at app start.
   * The service syncs translations and Material date locale via its constructor.
   */
  public constructor(_localization: LocalizationService) {
    afterNextRender(
      () => {
        appendSnackBarMotionStyleElement();
      },
      { injector: this._injector }
    );
  }
}
