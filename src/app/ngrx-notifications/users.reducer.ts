import { createReducer, on } from '@ngrx/store';
import { fillInfo } from './users.actions';
import { UserModel } from '../interfaces/user-model';


const initState: UserModel[] = [];

export const UsersReducer = createReducer(
  initState,
  on(fillInfo, (state, { users }) => {
    return [...users]
  })
);



