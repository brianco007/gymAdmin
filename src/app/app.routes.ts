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

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    title: "NextGym | Incio"
  },
  {
    path: "users",
    component: UsersComponent,
    title: "NextGym | Usuarios",
    canActivate: [activateGuard]
  },
  {
    path: "store",
    component: StoreComponent,
    title: "NextGym | Tienda"
  },
  {
    path: "details/:id",
    component: DetailsComponent,
    title: "NextGym | Detalles"
  },
  {
    path: "create",
    component: CreateComponent,
    title: "NextGym | Crear"
  },
  {
    path: "delete/:id",
    component: DeleteComponent,
    title: "NextGym | Eliminar"
  },
  {
    path: "edit/:id",
    component: EditComponent,
    title: "NextGym | Editar"
  },
  {
    path: "login",
    component: LoginComponent,
    title: "NextGym | Inicio de Sesión",
  },
  {
    path: "signup",
    component: SignupComponent,
    title: "NextGym | Registrarse"
  },
  {
    path: "clients",
    component: ClientsComponent,
    title: "NextGym | Clientes"
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "**",
    component: NotFoundComponent,
    title: "NextGym | Not Found"
  },
];
