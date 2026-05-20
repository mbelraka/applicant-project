import type { AppNotification } from '../../../models/app-notification.model';

export type NotificationSnackBarData = Omit<AppNotification, 'durationMs'>;
