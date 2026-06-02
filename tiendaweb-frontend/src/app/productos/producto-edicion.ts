import {Component, inject} from '@angular/core';
import {RouterLink, Router, ActivatedRoute} from '@angular/router';
import {Producto} from './producto';
import {FormsModule} from '@angular/forms';
import {ApiClient} from '../core/http/api-client';

@Component({
  selector: 'app-producto',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './producto-edicion.html',
})
export class ProductoEdicion {

  producto: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0
  }

  private backendApi = inject(ApiClient);
  private url = 'http://localhost:5056/GestionProductos'; //si el puerto de dotnet es diferente cambiar aquI

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id > 0) {
      this.backendApi.get<Producto>(this.url+'/'+id).subscribe({
        next: data => this.producto = data,
        error: error => console.error('Error al obtener producto', error)
      });
    }
  }

  guardar() {
    if (this.producto.id == 0) {
      this.crear();
    } else {
      this.actualizar();
    }
  }

  crear() {
    this.backendApi.post<Producto>(this.url+'/',this.producto).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: error => console.error('Error al crear producto', error)
    });
  }

  actualizar() {
    this.backendApi.put(this.url+'/'+this.producto.id,this.producto).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: error => console.error('Error al actualizar producto', error)
    });
  }
}
