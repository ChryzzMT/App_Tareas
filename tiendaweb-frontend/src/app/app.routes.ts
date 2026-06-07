import { Routes } from '@angular/router';
import {ProductoLista} from './productos/producto-lista';
import {ProductoEdicion} from './productos/producto-edicion';
import { ManejoLogin } from './Login/manejo-login';
import {CrearCuenta} from './CrearCuenta/crearcuenta';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: ManejoLogin },
  {path: 'crearcuenta', component:CrearCuenta},
];
