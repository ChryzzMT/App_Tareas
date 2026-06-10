import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ApiClient} from '../core/http/api-client';
import {RouterLink, Router, ActivatedRoute} from '@angular/router';
import {Tarea} from '../Tareas/tareas';

@Component({
  selector: 'app-mostrarmatriz',
  imports: [RouterLink,FormsModule],
  templateUrl: './mostrarmatriz.html',
})
export class Mostrarmatriz {

  private api = inject(ApiClient);
  private url = "http://localhost:5056/GestionImpactoEsfuerzo";

  ListaDescartar : Tarea [] = []
  ListaOportunidades : Tarea [] = []
  ListaGananciasRapidas : Tarea [] = []
  ListaGananciasMinimas : Tarea [] = []

  ngOnInit() {
    const userid = localStorage.getItem('usuarioId');

    // Mandamos por parámetro tradicional: .../GestionImpactoEsfuerzo/SetUserid?id=1
    this.api.put(`${this.url}/SetUser?id=${userid}`, {}).subscribe({
      next : () => {
        console.log("Matriz inicializada correctamente para el usuario:", userid);
        this.CargarListaDescartar();
        this.CargarListaGananciasRapidas();
        this.CargarListaGanananciasmenores();
        this.CargarListaOportunidades();
      },
      error: error => console.error("Error al inicializar usuario en la matriz", error)
    });
  }




  CargarListaDescartar(){
    this.api.get<Tarea[]>(`${this.url}/tareas-descartar`).subscribe({
      next : data => this.ListaDescartar = data,
      error: error => console.log("Error al cargar", error)
    }) ;
  }

  CargarListaGananciasRapidas() {
    this.api.get<Tarea[]>(`${this.url}/tareas-gananciarapida`).subscribe({
      next : data => this.ListaGananciasRapidas = data,
      error: error => console.log("Error al cargar", error)
    }) ;
  }

  CargarListaGanananciasmenores () {
    this.api.get<Tarea[]>(`${this.url}/tareas-menorgan`).subscribe({
      next : data => this.ListaGananciasMinimas = data,
      error: error => console.log("Error al cargar", error)
    }) ;
  }

  CargarListaOportunidades () {
    this.api.get<Tarea[]>(`${this.url}/tareas-oportunidades`).subscribe({
      next : data => this.ListaOportunidades = data,
      error: error => console.log("Error al cargar", error)
    }) ;
  }

}


