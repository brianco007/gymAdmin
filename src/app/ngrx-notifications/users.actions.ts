import { createAction, props } from '@ngrx/store';
import { UserModel } from '../interfaces/user-model';

export const fillInfo = createAction(
  "[Users Component] Llenar informacion",
  props<{users: UserModel[]}>()
)