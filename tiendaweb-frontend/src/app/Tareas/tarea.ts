import { Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Materia } from '../Materias/materia';
import {Tarea} from './tareas';
import {MateriaEdicion} from '../Materias/materia-edicion';

@Component({
  selector: 'app-tarea',
  imports: [RouterLink, FormsModule],
  templateUrl: './tarea.html'
})
export class TareaEdicion {
  private api = inject(ApiClient);
  private router = inject(Router);
  private url = 'http://localhost:5056/GestionTareas';

  tarea:Tarea={
    idTarea:0,
    estado:'',
    titulo:'',
    pesoTarea:0,
    descripcion:'',
    fechaEntrega:'',
    idMateria:0,
    materia: null!
  }

  guardar() {
    this.api.post(this.url + '/Crear-Tarea', this.tarea).subscribe({
      next: () => {
        // this.tarea = {idTarea: 0, titulo: '', descripcion: '', fechaEntrega: '', pesoTarea: 0, estado: '', idMateria: 0};
        this.router.navigate(['/tareas']);
      },
      error: error => console.error('Error al guardar la tarea', error)
    });
  }

  actualizar() {
    this.api.put(this.url + '/Actualizar-Todo', this.tarea).subscribe({
      next: () => this.router.navigate(['/tareas']),
      error: error => console.error('Error al actualizar la tarea', error)
    });
  }

  esEdicion = false;

  materias: {idMateria: number, nombreMateria: string}[] = [];

  ngOnInit() {
    const usuarioId = localStorage.getItem('usuarioId');
    const state = history.state;
    if (state && state['tarea']) {
      this.tarea = state['tarea'];
      this.esEdicion = true;
    }

    this.api.put('http://localhost:5056/GestionMaterias/SetUsuario?userid=' + usuarioId, {}).subscribe({
      next: () => {
        this.api.get<{idMateria: number, nombreMateria: string}[]>('http://localhost:5056/GestionMaterias/lista-materias').subscribe({
          next: data => this.materias = data,
          error: error => console.error('Error al obtener materias', error)
        });
      }
    });
  }
}
