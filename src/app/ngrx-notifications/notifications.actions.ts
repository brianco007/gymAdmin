import { createAction, props } from '@ngrx/store';
import { Notification } from './notifications.model';

export const addNotification = createAction(
  '[Users Component] Add notification',
  props<{ notification: Notification }>()
);


export const deleteNotification = createAction(
  "[Notification Component] Delete notification",
  props<{notificationId: string}>()
)

