import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ApiClient} from '../core/http/api-client';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Tarea} from '../Tareas/tareas';

@Component({
  selector: 'app-mostrarmatriz',
  standalone:true,
  imports: [RouterLink,FormsModule],
  templateUrl: './mostrarmatriz.html',
})
export class Mostrarmatriz {

  private api = inject(ApiClient);
  private url = "http://localhost:5056/GestionImpactoEsfuerzo";
  private router = inject(Router);

  ListaDescartar : Tarea [] = []
  ListaOportunidades : Tarea [] = []
  ListaGananciasRapidas : Tarea [] = []
  ListaGananciasMinimas : Tarea [] = []

  ngOnInit() {
    const userid = localStorage.getItem('usuarioId');

    this.api.put(`${this.url}/SetUser?id=${userid}`, {}).subscribe({
      next: () => {
        this.api.put(this.url + '/asignar-impactoesfuerzo', {}).subscribe({
          next: () => {
            this.CargarListaDescartar();
            this.CargarListaGananciasRapidas();
            this.CargarListaGanananciasmenores();
            this.CargarListaOportunidades();
          }
        });
      }
    });
  }

CargarEsfuerzoImpacto(){
    this.api.put(this.url+'/asignar-impactoesfuerzo',{}).subscribe({
      next : () =>this.router.navigate(['/matriz']),
      error:error => console.error(error)
    });
}
  CargarListaDescartar(){
    this.api.get<Tarea[]>(this.url+'/tareas-descartar').subscribe({
      next : data => this.ListaDescartar = data,
      error: error => console.log("Error al cargar", error)
    }) ;
  }

  CargarListaGananciasRapidas() {
    this.api.get<Tarea[]>(this.url+'/tareas-gananciarapida').subscribe({
      next : data => this.ListaGananciasRapidas = data,
      error: error => console.log("Error al cargar", error)
    }) ;
  }

  CargarListaGanananciasmenores () {
    this.api.get<Tarea[]>(this.url+'/tareas-menorgan').subscribe({
      next : data => this.ListaGananciasMinimas = data,
      error: error => console.log("Error al cargar", error)
    }) ;
  }

  CargarListaOportunidades () {
    this.api.get<Tarea[]>(this.url+'/tareas-oportunidades').subscribe({
      next : data => this.ListaOportunidades = data,
      error: error => console.log("Error al cargar", error)
    }) ;
  }

}


