import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable, startWith } from 'rxjs';

import { APP_CONFIG } from '../../../config/app.config';
import { Languages } from '../../../enums/language.enum';
import { FullState } from '../../../models/full-state.model';
import { NavLink } from 'src/app/modules/main/models/nav-link.model';
import { fadeInOutAnimation } from 'src/app/shared/animations/fade-in-out.animation';
import { LocalizationService } from '../../../services/localization.service';
import { selectAppLanguage } from '../../../state/app.selectors';
import { isLanguage } from '../../../utilities/language.utils';

@Component({
  selector: 'app-root-shell',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [fadeInOutAnimation],
})
export class RootComponent implements OnInit {
  public readonly navLinks: readonly NavLink[] = APP_CONFIG.NAV_LINKS;

  public readonly supportedLanguages =
    APP_CONFIG.LOCALIZATION.SUPPORTED_LANGUAGES;

  public currentRoute$!: Observable<NavLink | undefined>;

  public readonly language$ = this.store.select(selectAppLanguage);

  public constructor(
    private readonly router: Router,
    private readonly store: Store<FullState>,
    private readonly localization: LocalizationService
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

  private resolveNavForUrl(url: string): NavLink | undefined {
    return this.navLinks.find((link) => link.link === url);
  }
}
