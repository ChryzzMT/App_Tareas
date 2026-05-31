import { Routes } from '@angular/router';
import {ProductoLista} from './productos/producto-lista';
import {ProductoEdicion} from './productos/producto-edicion';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoLista },
  { path: 'productos/editar/:id', component: ProductoEdicion }
];
