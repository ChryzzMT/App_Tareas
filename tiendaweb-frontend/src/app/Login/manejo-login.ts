import {Component, inject} from '@angular/core';
import {usuario} from './Usuario';
import {FormsModule} from '@angular/forms';
import {ApiClient} from '../core/http/api-client';
import {RouterLink, Router, ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {email} from '@angular/forms/signals';

@Component({
  selector: 'app-manejo-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './manejo-login.html',
})
export class ManejoLogin {

  Usuario  : usuario = {
    idUsuario : 0,
    nombre:"",
    email : "",
    contrasena:""

  };

  private  api = inject(ApiClient);
  private url = 'http://localhost:5056/GestionUsuario/VerificarUsuario'

  // email : string = "";
  // contrasena: string = "";
  errormensaje: string = "";
  aviso: string = "";

  constructor(
    private apiService: ApiClient,
    private router: Router
  ) {

    const navegacion = this.router.getCurrentNavigation();

    const paginaAnterior = navegacion?.previousNavigation?.finalUrl?.toString();

    if (paginaAnterior && paginaAnterior.includes('/crearcuenta')) {
      this.aviso = "¡Tu cuenta ha sido creada con éxito! Por favor, introduce tus datos para iniciar sesión.";
    }

  }

  Login(): void {
    if (!this.Usuario.email || !this.Usuario.contrasena) {
      this.errormensaje = "Por favor, llene todos los campos.";
      return;
    }

    const endpoint = `${this.url}?m=${this.Usuario.email}&c=${this.Usuario.contrasena}`;

    this.apiService.get<usuario>(endpoint).subscribe({
      next: (Usuariologueado: usuario) => {
        if (Usuariologueado) {
          localStorage.setItem('usuarioId', Usuariologueado.idUsuario.toString());
          localStorage.setItem('usuarioNombre', Usuariologueado.nombre);

          this.apiService.put(`http://localhost:5056/GestionMaterias/SetUsuario?userid=${Usuariologueado.idUsuario}`, {}).subscribe();

          this.apiService.post(`http://localhost:5056/GestionTareas/SETUSUARIO?usuario=${Usuariologueado.idUsuario}`, {}).subscribe({
            next: () => {
              this.router.navigate(['/tareas']);
            },
            error: err => console.error('Error seteando usuario tareas', err)
          });

        } else {
          this.errormensaje = 'El correo o la contraseña son incorrectos.';
        }
      },
      error: (err) => {
        console.error('Error al conectar con .NET:', err);
        this.errormensaje = 'Hubo un fallo de comunicación con el servidor.';
      }
    });
  }
  protected readonly RouterLink = RouterLink;
}
