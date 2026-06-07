import {Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import {RouterLink} from '@angular/router';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router'
import { Materia } from '../Materias/materia'


@Component({
  selector: 'app-tareas',
  imports: [RouterLink, CommonModule],
  templateUrl: './tareas.html',
})
export class Tareas {
  private api = inject(ApiClient);
  private url = 'http://localhost:5056/GestionTareas';

  tareas: Tarea[] = [];

  ngOnInit() {
    const usuarioId = localStorage.getItem('usuarioId');

    this.api.post(this.url + '/SETUSUARIO?usuario=' + usuarioId, {}).subscribe({
      next: () => {
        this.api.get<Tarea[]>(this.url + '/Listar-Tareas').subscribe({
          next: data => this.tareas = data,
          error: error => console.error('Error al obtener tareas', error)
        });
      }
    });
  }

    eliminar(titulo: string) {
    this.api.delete(this.url + '/Eliminar-Tarea/' + titulo).subscribe({
      next: () => this.tareas = this.tareas.filter(t => t.titulo !== titulo),
      error: error => console.error( 'Error al eliminar tarea', error)
    });
  }

  private router = inject(Router)

  editar(tarea: Tarea) {
    this.router.navigate(['/tarea'], { state: { tarea } });
  }
}

export interface Tarea {
  idTarea: number;
  titulo: string;
  descripcion: string;
  pesoTarea: number;
  fechaEntrega:string;
  estado: string;
  materia: Materia;
}

