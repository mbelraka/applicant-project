import { Component } from '@angular/core';

import { LocalizationService } from './services/localization.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  public constructor(private readonly _localization: LocalizationService) {}
}
