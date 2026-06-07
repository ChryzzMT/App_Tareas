import { Routes } from '@angular/router';
import { Tareas} from './Tareas/tareas';
import {Tarea} from './Tareas/tarea';
import { ManejoLogin } from './Login/manejo-login';
import {CrearCuenta} from './CrearCuenta/crearcuenta';
import {ListaMaterias } from './Materias/lista-materias';
import {MateriaEdicion} from'./Materias/materia-edicion'
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'tareas', component: Tareas },
  { path: 'tarea', component: Tarea },
  { path: 'login', component: ManejoLogin },
  {path: 'crearcuenta', component:CrearCuenta},
  { path: 'materias', component: ListaMaterias },
  {path: 'materias/editar', component:MateriaEdicion}
];
