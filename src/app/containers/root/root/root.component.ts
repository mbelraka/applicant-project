import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, map, Observable, startWith } from 'rxjs';

import { NavLink } from 'src/app/modules/main/models/nav-link.model';

import { APP_CONFIG } from '../../../config/app.config';
import { Languages } from '../../../enums/language.enum';
import { FullState } from '../../../models/full-state.model';
import { LocalizationService } from '../../../services/localization.service';
import { selectAppLanguage } from '../../../state/app.selectors';
import { isLanguage } from '../../../utilities/language.utils';

@Component({
  selector: 'app-root-shell',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  standalone: false,
})
export class RootComponent implements OnInit {
  /** Landing / home route (main module). */
  public readonly landingRoute = APP_CONFIG.NAV_LINKS[0].link;

  public readonly navLinks: readonly NavLink[] = APP_CONFIG.NAV_LINKS;

  public readonly supportedLanguages =
    APP_CONFIG.LOCALIZATION.SUPPORTED_LANGUAGES;

  public get sortedSupportedLanguages(): readonly Languages[] {
    return [...this.supportedLanguages].sort((a, b) =>
      this.getLanguageLabel(a).localeCompare(
        this.getLanguageLabel(b),
        undefined,
        {
          sensitivity: 'base',
        }
      )
    );
  }

  public currentRoute$!: Observable<NavLink | undefined>;

  public readonly language$ = this.store.select(selectAppLanguage);

  public constructor(
    private readonly router: Router,
    private readonly store: Store<FullState>,
    private readonly localization: LocalizationService,
    private readonly translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.currentRoute$ = this.router.events.pipe(
      startWith(this.resolveNavForUrl(this.router.url)),
      map(() => this.resolveNavForUrl(this.router.url)),
      distinctUntilChanged()
    );
  }

  public onLanguageChange(value: unknown): void {
    if (isLanguage(value)) {
      this.localization.setLanguage(value);
    }
  }

  public getLanguageLabel(language: Languages): string {
    return this.translate.instant(`language.names.${language}`);
  }

  private resolveNavForUrl(url: string): NavLink | undefined {
    return this.navLinks.find((link) => link.link === url);
  }
}
