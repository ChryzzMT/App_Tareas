import {Component, inject} from '@angular/core';
import {ApiClient} from '../core/http/api-client';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Materia} from './materia';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-materia-edicion',
  standalone:true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './materia-edicion.html',
})
export class MateriaEdicion {
  materia: Materia = {
    idMateria: 0,
    nombreMateria: '',
    prioridadMateria: '',
    idUsuario: 0
  }

  private backendApi = inject(ApiClient);
  private url = 'http://localhost:5056/GestionMaterias'; //si el puerto de dotnet es diferente cambiar aquI

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id > 0) {
      this.backendApi.get<Materia>(this.url+'/'+id).subscribe({
        next: data => this.materia = data,
        error: error => console.error('Error al obtener producto', error)
      });
    }
  }

  guardar() {
    console.log('Botón guardar presionado');
    if (this.materia.idMateria == 0) {
      this.crear();
    } else {
      this.actualizar();
    }
  }

  crear() {
    this.backendApi.post<Materia>(this.url+'/agregar-materia',this.materia).subscribe({
      next: () => this.router.navigate(['/materias']),
      error: error => console.error('Error al crear materia', error)
    });
  }

  actualizar() {
    this.backendApi.put(this.url+'/'+this.materia.idMateria,this.materia).subscribe({
      next: () => this.router.navigate(['/materias']),
      error: error => console.error('Error al actualizar materia', error)
    });
  }

}
