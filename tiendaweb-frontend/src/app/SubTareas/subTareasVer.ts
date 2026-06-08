import { Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subtarea } from './Subtarea';
import {Tarea} from '../Tareas/tarea';

@Component({
  selector: 'app-materias',
  imports: [RouterLink],
  templateUrl: './subTareasVer.html',
})
export class SubTareasVer {
  subtarea: Subtarea ={
    idsubtarea: 0,
    descripcion: '',
    idtarea:0
  }
  private api = inject(ApiClient);
  private router = inject(Router);
  private url = 'http://localhost:5056/GestionSubtarea';

  subtareas: Subtarea[] = []

  idtarea: number = 0;

  ngOnInit() {
    const state = history.state;
    if (state && state['idTarea']) {
      this.idtarea = state['idTarea'];
    }
    this.cargarsubtareas();
  }



  cargarsubtareas() {
    this.api.get<Subtarea[]>(this.url + '/ListarSubtareas/' + this.idtarea).subscribe({
      next: data => this.subtareas = data,
      error: error => console.error('Error al obtener materias', error)
    });
  }

  eliminarsubtarea(idsubtarea: number) {
    this.api.delete(this.url + '/DeleteSubtarea/' + idsubtarea).subscribe({
      next: () => this.subtareas = this.subtareas.filter(s => s.idsubtarea !== idsubtarea),
      error: error => console.error('Error al eliminar materia', error)
    });
  }
}



