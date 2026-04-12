import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { MainComponent } from 'src/app/modules/main/components/main.component';
import { MatButtonModule } from '@angular/material/button';

describe('MainComponent', () => {
  let fixture: ComponentFixture<MainComponent>;
  let component: MainComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [
        RouterModule.forRoot([]),
        FlexLayoutModule,
        MatButtonModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render headline and sub-headline placeholders', () => {
    const headline = fixture.debugElement.query(By.css('.headline'));
    const sub = fixture.debugElement.query(By.css('.sub-headline'));
    expect(headline).toBeTruthy();
    expect(sub).toBeTruthy();
    expect(headline.nativeElement.textContent).toContain('main.headline');
    expect(sub.nativeElement.textContent).toContain('main.subHeadline');
  });

  it('should link primary CTA to applicants route', () => {
    const primary = fixture.debugElement.query(By.css('.main-cta'));
    expect(primary).toBeTruthy();
    const routerLink = primary.injector.get(RouterLink);
    const router = TestBed.inject(Router);
    expect(routerLink.urlTree).not.toBeNull();
    expect(router.serializeUrl(routerLink.urlTree!)).toBe('/root/applicants');
  });

  it('should render hero image asset', () => {
    const img = fixture.debugElement.query(By.css('.main-image'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.getAttribute('src')).toBe('assets/main-image.png');
  });

  it('should render overlay copy keys', () => {
    const title = fixture.debugElement.query(By.css('.overlay-title'));
    const subtitle = fixture.debugElement.query(By.css('.overlay-subtitle'));
    expect(title.nativeElement.textContent).toContain('main.overlayTitle');
    expect(subtitle.nativeElement.textContent).toContain(
      'main.overlaySubtitle'
    );
  });
});
