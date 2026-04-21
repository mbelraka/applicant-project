import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedJobTitle',
  pure: false,
  standalone: false,
})
export class LocalizedJobTitlePipe implements PipeTransform {
  private readonly jobTitleKeyByValue: Record<string, string> = {
    'Senior Frontend Engineer': 'jobTitles.seniorFrontendEngineer',
    'QA Automation Lead': 'jobTitles.qaAutomationLead',
    'UI Engineer': 'jobTitles.uiEngineer',
    'Product Designer': 'jobTitles.productDesigner',
    'Engineering Manager': 'jobTitles.engineeringManager',
    'Backend Engineer': 'jobTitles.backendEngineer',
    'DevOps Engineer': 'jobTitles.devopsEngineer',
    'Full-stack Developer': 'jobTitles.fullStackDeveloper',
    'Data Engineer': 'jobTitles.dataEngineer',
    'Mobile Engineer': 'jobTitles.mobileEngineer',
    'Site Reliability Engineer': 'jobTitles.siteReliabilityEngineer',
  };

  public constructor(private readonly translate: TranslateService) {}

  public transform(value: string | null | undefined): string {
    const raw = value?.trim();
    if (!raw) {
      return '';
    }
    const key = this.jobTitleKeyByValue[raw];
    if (!key) {
      return raw;
    }
    const translated = this.translate.instant(key);
    return translated === key ? raw : translated;
  }
}
