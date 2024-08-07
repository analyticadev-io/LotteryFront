import { Routes } from '@angular/router';
import { LoginComponent } from './pages/Login/login/login.component';
import { HomeComponent } from './pages/Home/home/home.component';
import { RegistroComponent } from './pages/Registro/registro/registro.component';

export const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"registro",component:RegistroComponent},
  {path:"home",component:HomeComponent}
];
