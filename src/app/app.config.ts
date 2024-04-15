import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { StoreModule, provideState, provideStore } from '@ngrx/store';
import { NotificationsReducer } from './ngrx-notifications/notifications.reducer';
import { UsersReducer } from './ngrx-notifications/users.reducer';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideHttpClient(),
    provideStore(),
    provideState({name: 'notifications', reducer: NotificationsReducer}),
    provideState({name: 'listadoDeUsuarios', reducer: UsersReducer})
  ]

};
