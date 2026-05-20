import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicationStatus } from '../../enums/application-status.enum';
import { ApplicationStatusChipComponent } from './application-status-chip.component';

describe('ApplicationStatusChipComponent', () => {
  let component: ApplicationStatusChipComponent;
  let fixture: ComponentFixture<ApplicationStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationStatusChipComponent],
      imports: [TranslateModule.forRoot(), SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationStatusChipComponent);
    component = fixture.componentInstance;
  });

  it('should render the translated status key and aria label', () => {
    component.status = ApplicationStatus.Received;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.textContent).toContain('applicationStatus.received');
    expect(host.getAttribute('aria-label')).toBe(
      'applicantList.applicationStatus: applicationStatus.received'
    );
  });

  it('should apply host status modifier classes', () => {
    component.status = ApplicationStatus.InterviewScheduled;
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('application-status-chip')).toBeTrue();
    expect(
      host.classList.contains('application-status-chip--interview_scheduled')
    ).toBeTrue();
    expect(host.classList.contains('application-status-chip--received')).toBe(
      false
    );
  });
});
