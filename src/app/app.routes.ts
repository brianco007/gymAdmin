import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UsersComponent } from './components/users/users.component';
import { DetailsComponent } from './components/details/details.component';
import { CreateComponent } from './components/create/create.component';
import { DeleteComponent } from './components/delete/delete.component';
import { EditComponent } from './components/edit/edit.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { activateGuard } from './guards/activate.guard'; 
import { StoreComponent } from './components/store/store.component';
import { ClientsComponent } from './components/clients/clients.component';
import { TicketsComponent } from './components/tickets/tickets.component';

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    title: "NextGymPro | Incio"
  },
  {
    path: "users",
    component: UsersComponent,
    title: "NextGymPro | Mensualidades",
  },
  {
    path: "tickets",
    component: TicketsComponent,
    title: "NextGymPro | Tiqueteras",
    canActivate: [activateGuard]
  },
  {
    path: "store",
    component: StoreComponent,
    title: "NextGymPro | Tienda"
  },
  {
    path: "details/:id",
    component: DetailsComponent,
    title: "NextGymPro | Detalles"
  },
  {
    path: "create",
    component: CreateComponent,
    title: "NextGymPro | Crear"
  },
  {
    path: "delete/:id",
    component: DeleteComponent,
    title: "NextGymPro | Eliminar"
  },
  {
    path: "edit/:id",
    component: EditComponent,
    title: "NextGymPro | Editar"
  },
  {
    path: "login",
    component: LoginComponent,
    title: "NextGymPro | Inicio de Sesión",
  },
  {
    path: "signup",
    component: SignupComponent,
    title: "NextGymPro | Registrarse"
  },
  {
    path: "clients",
    component: ClientsComponent,
    title: "NextGymPro | Clientes"
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "**",
    component: NotFoundComponent,
    title: "NextGymPro | Not Found"
  },
];
