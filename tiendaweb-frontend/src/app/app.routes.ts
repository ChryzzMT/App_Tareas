import { Routes } from '@angular/router';
import {ProductoLista} from './productos/producto-lista';
import {ProductoEdicion} from './productos/producto-edicion';
import { ManejoLogin } from './Login/manejo-login';
import {CrearCuenta} from './CrearCuenta/crearcuenta';
import {ListaMaterias } from './materias/lista-materias';
import {MateriaEdicion} from'./materias/materia-edicion'
export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoLista },
  { path: 'productos/editar/:id', component: ProductoEdicion },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: ManejoLogin },
  {path: 'crearcuenta', component:CrearCuenta},
  { path: 'materias', component: ListaMaterias },
  {path: 'materias/editar', component:MateriaEdicion}
];
