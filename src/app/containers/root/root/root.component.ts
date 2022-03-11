import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { distinctUntilChanged, map, Observable, startWith } from 'rxjs';

import { ROOT_CONFIG } from 'src/app/containers/root/config/root.config';
import { NavLink } from 'src/app/modules/main/main/models/nav-link.model';
import {fadeInOutAnimation} from 'src/app/shared/animations/fade-in-out.animation';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [fadeInOutAnimation]
})
export class RootComponent implements OnInit {
  // Constants
  public readonly navLinks: NavLink[] = ROOT_CONFIG.navLinks;

  // Observables
  public currentRoute$: Observable<NavLink>;
  public currentPageHeader$: Observable<string>;

  public constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    this.currentRoute$ = this.router.events.pipe(
      startWith(this._getNavItem(this.router.url)),
      map((_) => this._getNavItem(this.router.url)),
      distinctUntilChanged()
    );

    this.currentPageHeader$ = this.currentRoute$.pipe(
      map((navLink) => navLink?.label),
      distinctUntilChanged()
    );
  }

  private _getNavItem(url: string): NavLink {
    return this.navLinks?.find((navLink) => navLink?.link === url);
  }
}
