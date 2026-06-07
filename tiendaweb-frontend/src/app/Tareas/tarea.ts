import { Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Materia } from '../Materias/materia'

@Component({
  selector: 'app-tarea',
  imports: [RouterLink, FormsModule],
  templateUrl: './tarea.html'
})
export class Tarea {
  private api = inject(ApiClient);
  private router = inject(Router);
  private url = 'http://localhost:5056/GestionTareas';

  tarea = {
    idTarea: 0,
    titulo: '',
    descripcion: '',
    pesoTarea: 0,
    fechaEntrega: '',
    estado: '',
    nombreMateria: '',
  };

  guardar() {
    this.api.post(this.url + '/Crear-Tarea', this.tarea).subscribe({
      next: () => {
        this.tarea = {idTarea: 0, titulo: '', descripcion: '', fechaEntrega: '', pesoTarea: 0, estado: '', nombreMateria: ''};
        this.router.navigate(['/tareas']);
      },
      error: error => console.error('Error al guardar la tarea', error)
    });
  }

  actualizar() {
    this.api.put(this.url + '/Actualizar-Todo', this.tarea).subscribe({
      next: () => {
        this.tarea = {idTarea: 0, titulo: '', descripcion: '', fechaEntrega: '', pesoTarea: 0, estado: '', nombreMateria: ''};
        this.router.navigate(['/tareas']);
      },
      error: error => console.error('Error al actualizar la tarea', error)
    });
  }

  esEdicion = false;

  materias: {idMateria: number, nombreMateria: string}[] = [];

  ngOnInit() {
    const usuarioId = localStorage.getItem('usuarioId');

    // Cargar materias del usuario
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
