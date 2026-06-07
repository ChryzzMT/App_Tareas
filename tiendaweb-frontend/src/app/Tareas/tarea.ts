import { Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    idMateria: 0
  };

  guardar() {
    this.api.post(this.url + '/Crear-Tarea', this.tarea).subscribe({
      next: () => {
        this.tarea = {idTarea: 0, titulo: '', descripcion: '', fechaEntrega: '', pesoTarea: 0, estado: '', idMateria: 0};
        this.router.navigate(['/tareas']);
      },
      error: error => console.error('Error al guardar la tarea', error)
    });
  }

  actualizar() {
    this.api.put(this.url + '/Actualizar-Todo', this.tarea).subscribe({
      next: () => {
        this.tarea = {idTarea: 0, titulo: '', descripcion: '', fechaEntrega: '', pesoTarea: 0, estado: '', idMateria: 0};
        this.router.navigate(['/tareas']);
      },
      error: error => console.error('Error al actualizar la tarea', error)
    });
  }

  esEdicion = false;

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['tarea']) {
      this.tarea = nav.extras.state['tarea'];
      this.esEdicion = true;
    } else {
      // Si getCurrentNavigation() ya es null, buscar en history.state
      const state = history.state;
      if (state && state['tarea']) {
        this.tarea = state['tarea'];
        this.esEdicion = true;
      }
    }
  }

}
