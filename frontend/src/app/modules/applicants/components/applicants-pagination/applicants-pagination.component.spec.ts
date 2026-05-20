import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicantsPaginationComponent } from './applicants-pagination.component';

describe('ApplicantsPaginationComponent', () => {
  let component: ApplicantsPaginationComponent;
  let fixture: ComponentFixture<ApplicantsPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantsPaginationComponent],
      imports: [TranslateModule.forRoot(), SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicantsPaginationComponent);
    component = fixture.componentInstance;
    component.pageCount = 3;
    component.pageNumbers = [1, 2, 3];
    fixture.detectChanges();
  });

  it('should emit a valid page index when navigating', () => {
    spyOn(component.pageChange, 'emit');

    component.goToNextPage();
    component.goToPage(2);
    component.pageIndex = 1;
    component.goToPreviousPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(0);
  });

  it('should ignore out-of-range page requests', () => {
    spyOn(component.pageChange, 'emit');

    component.goToPage(-1);
    component.goToPage(3);

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
