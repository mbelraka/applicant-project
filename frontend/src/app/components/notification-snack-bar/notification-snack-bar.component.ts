import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { NOTIFICATION_MESSAGE_KEYS } from '../../constants/notification-message-keys';
import { AppNotificationType } from '../../enums/app-notification-type.enum';
import { NotificationSnackBarData } from './models/notification-snack-bar-data.model';

@Component({
  selector: 'app-notification-snack-bar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './notification-snack-bar.component.html',
  styleUrl: './notification-snack-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSnackBarComponent {
  protected readonly AppNotificationType = AppNotificationType;

  public readonly snackBarRef =
    inject<MatSnackBarRef<NotificationSnackBarComponent>>(MatSnackBarRef);
  public readonly data = inject<NotificationSnackBarData>(MAT_SNACK_BAR_DATA);

  public readonly dismissAriaKey = NOTIFICATION_MESSAGE_KEYS.dismissAria;

  public dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
