import {Component, inject} from '@angular/core';
import {RouterLink, Router} from '@angular/router';
import {ApiClient} from '../core/http/api-client';
import {Materia} from './materia';

@Component({
  selector: 'app-materias',
  imports: [RouterLink],
  templateUrl: './lista-materias.html',
})
export class ListaMaterias {
  private api = inject(ApiClient);
  private router = inject(Router);
  private url = 'http://localhost:5056/GestionMaterias';

  materias: Materia[] = [];

  ngOnInit() {
    this.cargarMaterias();
  }

  private cargarMaterias() {
    this.api.get<Materia[]>(this.url + '/lista-materias').subscribe({
      next: data => this.materias = data,
      error: error => console.error('Error al obtener materias', error)
    });
  }

  eliminar(nombre: string) {
    this.api.delete(this.url + '/eliminar-materia/' + nombre).subscribe({
      next: () => this.materias = this.materias.filter(m => m.nombreMateria !== nombre),
      error: error => console.error('Error al eliminar materia', error)
    });
  }
}
