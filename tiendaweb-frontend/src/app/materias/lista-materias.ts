import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ApiClient} from '../core/http/api-client';
import {Materia} from './Materia';

@Component({
  selector: 'app-materias',
  imports: [
    RouterLink
  ],
  templateUrl: './lista-materias.html',
})
export class ListaMaterias {
  private api = inject(ApiClient);
  private url = 'http://localhost:5056/GestionMaterias'; //si el puerto de dotnet es diferente cambiar aquI
  //SPA UNA SOLA PAGINA
  materias: Materia[] = [];

  ngOnInit() {
    this.cargarMaterias();
  }
  private cargarMaterias(){
    console.log('iniciando');
    this.api.get<Materia[]>(this.url+'/lista-materias').subscribe({
      next: data=> this.materias=data,
      error:error=>console.error('Error al obtener materias', error)
    });
  }

}

