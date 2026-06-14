import { Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {Tarea} from '../Tareas/tareas';
import {Materia} from '../Materias/materia';

@Component({
  selector: 'app-SubTareasVer',
  imports: [RouterLink],
  templateUrl: './subTareasVer.html',
})
export class SubTareasVer {
  private api = inject(ApiClient);
  private router = inject(Router);
  private url = 'http://localhost:5056/GestionSubtarea';

  subtareas: Subtarea1[] = []

  tarea: Tarea = {
    idTarea: 0,
    titulo: '',
    descripcion: '',
    pesoTarea: 0,
    fechaEntrega: '',
    estado: '',
    idMateria: 0,
    materia: null!
  }

  ngOnInit() {
    const state = history.state;
    if (state && state['tarea']) {
      this.tarea = state['tarea'];
    }
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.api.put(this.url+'/SetUser',usuarioId).subscribe({
      next: () => {this.cargarsubtareas()},
      error: error => console.error('Error al establecer usuario:', error)
    });
  }

  cargarsubtareas() {
    this.api.get<Subtarea1[]>(this.url+'/ListarSubtareas'+'?idtarea='+this.tarea.idTarea).subscribe({
      next: data => {
        this.subtareas = data;
        console.log('Subtareas cargadas:', data);
      },
      error: error => console.error('Error al obtener subtareas', error)
    });
  }

  cargarcrearsubtarea() {
    this.router.navigate(['/subtarea/crear'], { state: { tarea: this.tarea } });
  }

  eliminarsubtarea(idsubtarea: number) {
    this.api.delete(this.url+'/DeleteListaSubtareas'+'?='+idsubtarea).subscribe({
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



