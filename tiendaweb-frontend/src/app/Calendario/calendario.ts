import { Component, inject } from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule, RouterLink],
  templateUrl: './calendario.html',
})
export class Calendario {
  private api = inject(ApiClient);
  private url = 'http://localhost:5056/GestionCalendario';

  mesActual = new Date().getMonth() + 1;
  anioActual = new Date().getFullYear();

  dias: any[] = [];
  diasVacios: number[] = [];

  meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  nombreMes = this.meses[this.mesActual-1];
  ngOnInit() {
    const usuarioId = localStorage.getItem('usuarioId');
    this.api.put(this.url + '/setuserid?id=' + usuarioId, {}).subscribe({
      next: () => {
        this.api.put(this.url + '/RefrescarCalendario', {}).subscribe({
          next: () => this.cargarMes(),
        });
      }
    });
  }

  cargarMes() {
    this.nombreMes = this.meses[this.mesActual - 1];
    this.api.get<any>(this.url + '/ObtenerDiasdeunMes?year=' + this.anioActual + '&mes=' + this.mesActual).subscribe({
      next: data => {
        this.dias = data.listaDias;
        const primerDia = this.dias[0]?.diadelsemana;
        const offset = primerDia === 0 ? 6 : primerDia - 1; // Lunes = 0
        this.diasVacios = Array(offset).fill(0);
      },
      error: error => console.error('Error al cargar mes', error)
    });
  }

  mesAnterior() {
    if (this.mesActual === 1) {
      this.mesActual = 12;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.cargarMes();
  }

  mesSiguiente() {
    if (this.mesActual === 12) {
      this.mesActual = 1;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.cargarMes();
  }
}
