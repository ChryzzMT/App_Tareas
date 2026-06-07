import { Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-tarea',
  imports: [RouterLink, FormsModule],
  templateUrl: './tarea.html'
})

export class Tarea {
  private api = inject(ApiClient);
  private router = inject(Router);
  private url = 'http://localhost:5056/GestionTareas';

  tarea = {
    titulo: '',
    descripcion: '',
    pesoTarea: 0,
    fechaEntrega: '',
    estado: '',
    idMateria: 0
  };

  guardar() {
    this.api.post(this.url + '/Crear-Tarea', this.tarea).subscribe({
      next: () => {
        this.tarea = {titulo: '', descripcion: '', fechaEntrega: '', pesoTarea: 0, estado: '', idMateria: 0};
        this.router.navigate(['/tareas'])
      },
      error: error => console.error('Error al guardar la tarea', error)
    })
  }

  eliminar() {
    this.api.delete(this.url + '/Eliminar-Tarea' + this.tarea.titulo).subscribe({
      next: () => {
        this.tarea = {titulo: '', descripcion: '', fechaEntrega: '', pesoTarea: 0, estado: '', idMateria: 0};
        this.router.navigate(['/tareas'])
      },
      error: error => console.error('Error al eliminar la tarea', error)
    })
  }

  actualizar() {
    this.api.put(this.url + '/Actualizar-Titulo', this.tarea).subscribe({
      next: () => {
        this.tarea = {titulo: '', descripcion: '', fechaEntrega: '', pesoTarea: 0, estado: '', idMateria: 0};
        this.router.navigate(['/tareas']);
      },
      error: error => console.error('Error al actualizar', error)
    });
  }

  esEdicion = false;

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if(state && state['tarea']) {
      this.tarea = state['tarea'];
      this.esEdicion = true;
    }
  }
}
