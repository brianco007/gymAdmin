import { createReducer, on } from '@ngrx/store';
import { addNotification, deleteNotification } from './notifications.actions';
import { Notification } from './notifications.model';

const initState: Notification[] = [];

export const NotificationsReducer = createReducer(
  initState,
  on(addNotification, (state, { notification }) => {
    const isNotificationDuplicate = state.some(existingNotification => {
      return existingNotification.id === notification.id;
    });

    if (isNotificationDuplicate) {
      return state;
    } else {
      return [...state, notification];
    }
  }),


  on(deleteNotification, (state, { notificationId }) => {
    return state.filter(item => item.id !== notificationId)
  })
)
