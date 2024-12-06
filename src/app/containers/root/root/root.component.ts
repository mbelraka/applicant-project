import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { NavLink } from 'src/app/modules/main/models/nav-link.model';
import { fadeInOutAnimation } from 'src/app/shared/animations/fade-in-out.animation';
import { RootState } from '../models/root-state.model';
import { APP_CONFIG } from '../../../config/app.config';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [fadeInOutAnimation],
})
export class RootComponent implements OnInit {
  // Constants
  public readonly navLinks: NavLink[] = APP_CONFIG.NAV_LINKS;

  // Observables
  public currentRoute$: Observable<NavLink>;
  public currentPageHeader$: Observable<string>;

  public constructor(
    private readonly _store: Store<RootState>,
    private readonly _router: Router
  ) {}

  public ngOnInit(): void {
    this._setUpRoutes();
  }

  private _setUpRoutes(): void {
    this.currentRoute$ = this._router.events.pipe(
      startWith(this._getNavItem(this._router.url)),
      map((_) => this._getNavItem(this._router.url)),
      distinctUntilChanged()
    );
  }

  private _getNavItem(url: string): NavLink {
    return this.navLinks?.find(
      (navLink: NavLink): boolean => navLink?.link === url
    );
  }
}
