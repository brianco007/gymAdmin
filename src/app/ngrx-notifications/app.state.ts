import { Notification } from './notifications.model';

export interface AppState {
  readonly notifications: Notification[];
}
