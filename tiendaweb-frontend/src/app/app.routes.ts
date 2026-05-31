import { Routes } from '@angular/router';
import {Productos} from './productos/productos';
import {ProductoEdicion} from './productos/producto-edicion';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: Productos },
  { path: 'productos/editar/:id', component: ProductoEdicion }
];
