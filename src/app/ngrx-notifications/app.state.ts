import { Notification } from './notifications.model';
import { UserModel } from '../interfaces/user-model';

export interface AppState {
  readonly notifications: Notification[];
  readonly listadoDeUsuarios : UserModel[];
}
