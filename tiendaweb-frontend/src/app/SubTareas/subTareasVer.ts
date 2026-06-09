import { Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// import { Subtarea } from './Subtarea';
import {Tarea} from '../Tareas/tareas';

@Component({
  selector: 'app-materias',
  imports: [RouterLink],
  templateUrl: './subTareasVer.html',
})
export class SubTareasVer {
  // subtarea: Subtarea ={
  //   idsubtarea: 0,
  //   descripcion: '',
  //   idtarea:0
  // }
  private api = inject(ApiClient);
  private router = inject(Router);
  private url = 'http://localhost:5056/GestionSubtarea';

  subtareas: Subtarea1[] = []

  idtarea: number = 0;

  ngOnInit() {
    const state = history.state;
    if (state && state['idTarea']) {
      this.idtarea = state['idTarea'];
    }

    const usuarioId = localStorage.getItem('usuarioId');


    this.api.put(`${this.url}/SetUser?id=${usuarioId}`, {}).subscribe({
      next: () => {
        console.log('Usuario configurado con éxito');

        this.cargarsubtareas();
      },
      error: error => console.error('Error al establecer usuario:', error)
    });
  }



  cargarsubtareas() {
    // Concatenamos '?idtarea=' antes del ID para que coincida con el backend
    this.api.get<Subtarea1[]>(`${this.url}/ListarSubtareas?idtarea=${this.idtarea}`).subscribe({
      next: data => {
        this.subtareas = data;
        console.log('Subtareas cargadas:', data);
      },
      error: error => console.error('Error al obtener subtareas', error)
    });
  }

  eliminarsubtarea(idsubtarea: number) {
    this.api.delete(`${this.url}/DeleteSubtarea?id=${idsubtarea}`).subscribe({
      next: () => this.subtareas = this.subtareas.filter(s => s.idsubtarea !== idsubtarea),
      error: error => console.error('Error al eliminar materia', error)
    });
  }
}

export interface Subtarea1 {
  idsubtarea: number;
  descripcion: string;
  idtarea: number;
  tarea: Tarea;

}



