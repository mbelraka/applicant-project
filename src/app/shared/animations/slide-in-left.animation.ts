import {
  animate,
  AnimationTriggerMetadata,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideInLeftAnimation: AnimationTriggerMetadata = trigger(
  'slideInLeftAnimation',
  [
    transition(':enter', [
      style({ transform: 'translateX(-1000px)' }),
      animate(
        '0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        style({ transform: 'translateX(0)' })
      ),
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0)' }),
      animate(
        '0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        style({ transform: 'translateX(-1000px)' })
      ),
    ]),
  ]
);
