import { Routes } from '@angular/router';
import { Tareas} from './Tareas/tareas';
import { TareaEdicion } from './Tareas/tarea-edicion';
import { ManejoLogin } from './Login/manejo-login';
import {CrearCuenta} from './CrearCuenta/crearcuenta';
import {ListaMaterias } from './Materias/lista-materias';
import {MateriaEdicion} from'./Materias/materia-edicion'
import { Calendario } from './Calendario/calendario';
import {SubTareasVer} from './SubTareas/subTareasVer';
import {Mostrarmatriz} from './Matriz/mostrarmatriz';
import {CrearSubtarea} from './SubTareas/crearsubtarea';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'tareas', component: Tareas },
  { path: 'tarea', component: TareaEdicion },
  { path: 'login', component: ManejoLogin },
  { path: 'crearcuenta', component:CrearCuenta},
  { path: 'materias', component: ListaMaterias },
  { path: 'materias/editar', component:MateriaEdicion},
  { path: 'calendario', component: Calendario },
  { path: 'subtareas' , component: SubTareasVer },
  { path : 'matriz'  ,  component : Mostrarmatriz },
  { path: 'subtarea/crear', component: CrearSubtarea }
];
