import { AppNotificationType } from '../enums/app-notification-type.enum';

export interface NotifyPayload {
  readonly type: AppNotificationType;
  readonly messageKey?: string;
  readonly messageParams?: Readonly<Record<string, string | number>>;
  readonly message?: string;
  readonly useErrorDuration?: boolean;
}
