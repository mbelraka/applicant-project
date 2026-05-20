import { AppNotificationType } from '../enums/app-notification-type.enum';

export interface AppNotification {
  readonly type: AppNotificationType;
  readonly durationMs?: number;
  /** Prefer ngx-translate; use with `messageParams` when the string interpolates values */
  readonly messageKey?: string;
  readonly messageParams?: Readonly<Record<string, string | number>>;
  /** Raw toast text (for example API errors); not localized */
  readonly message?: string;
}
