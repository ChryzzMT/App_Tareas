import { Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {Tarea} from '../Tareas/tareas';

@Component({
  selector: 'app-CrearSubtarea',
  imports: [RouterLink, FormsModule],
  templateUrl: './Crearsubtarea.html',
})

export class CrearSubtarea {
  private api = inject(ApiClient);
  private router = inject(Router);
  private url = 'http://localhost:5056/GestionSubtarea';

  tarea : Tarea = {
    idTarea: 0,
    titulo: '',
    descripcion: '',
    pesoTarea: 0,
    fechaEntrega: '',
    estado: '',
    idMateria: 0,
    materia: null!
  }

  subtarea1: Subtarea1 = {
    idsubtarea: 0,
    descripcion: "",
    idtarea: 0,
    tarea: null!
  }

  guardar() {
    this.api.post(
      `${this.url}/CreateSubtarea?tareaid=${this.subtarea1.idtarea}&descripcion=${this.subtarea1.descripcion}`,
      {}).subscribe({
      next: () => this.router.navigate(['/subtareas'],{ state: { tarea: this.tarea }}),
      error: error => console.error('Error al crear Subtarea', error)
    });
  }

  ngOnInit() {
    const state = history.state;
    if(state && state['tarea']) {
      this.tarea = state['tarea'];
      this.subtarea1.idtarea = this.tarea.idTarea;
    }
  }
}

export interface Subtarea1 {
  idsubtarea: number;
  descripcion: string;
  idtarea: number;
  tarea: Tarea;
}
