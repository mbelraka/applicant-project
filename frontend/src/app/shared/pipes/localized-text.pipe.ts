import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { localizeTextByNamespace } from '../../utilities/localization.utils';

@Pipe({
  name: 'localizedText',
  pure: false,
  standalone: false,
})
export class LocalizedTextPipe implements PipeTransform {
  public constructor(private readonly translate: TranslateService) {}

  public transform(
    value: string | null | undefined,
    namespace: string
  ): string {
    const raw = value?.trim();
    if (!raw) {
      return '';
    }
    return localizeTextByNamespace(raw, namespace, this.translate);
  }
}
