import {Component, inject} from '@angular/core';
import { ApiClient } from '../core/http/api-client';
import {RouterLink} from '@angular/router';
import {Producto} from './producto';

@Component({
  selector: 'app-productos',
  imports: [
    RouterLink
  ],
  templateUrl: './producto-lista.html',
})
export class ProductoLista {
  private api = inject(ApiClient);
  private url = 'http://localhost:5056/GestionProductos/VerificarUsuario'; //si el puerto de dotnet es diferente cambiar aquI
  //SPA UNA SOLA PAGINA
  productos: Producto[] = [];

  ngOnInit() {
    this.cargarProductos();
  }

  private cargarProductos() {
    console.log('iniciando');
    this.api.get<Producto[]>(this.url + '/lista-productos').subscribe({
      next: data => this.productos = data,
      error: error => console.error('Error al obtener productos', error)
    });
  }

  eliminar(id: number): void {
    this.api.delete(this.url+'/'+id).subscribe({
      next: () => this.cargarProductos(),
      error: error => console.error('Error al eliminar producto', error)
    });
  }
}
