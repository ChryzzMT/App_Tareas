import { Component, inject } from '@angular/core';
import { usuario } from '../Login/Usuario';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './crearcuenta.html',
})
export class CrearCuenta {


  Usuario: usuario = {
    idUsuario: 0,
    nombre: "",
    email: "",
    contrasena: ""
  };

  errormensaje: string = "";
  private url = 'http://localhost:5056/GestionUsuario/CrearUsuario';


  private http = inject(HttpClient);

  constructor(private router: Router) {}

  crearcuenta(): void {
    this.errormensaje = "";

    if (!this.Usuario.email || !this.Usuario.contrasena || !this.Usuario.nombre) {
      this.errormensaje = "Rellene los campos por favor";
      return;
    }


    const dataParaEnviar = {
      IdUsuario: 0,
      Nombre: this.Usuario.nombre,
      Email: this.Usuario.email,
      Contrasena: this.Usuario.contrasena
    };

    console.log("Enviando este JSON al backend:", dataParaEnviar);

    this.http.post<number>(this.url, dataParaEnviar).subscribe({
      next: (idcreado: number) => {
        console.log('Respuesta de .NET (ID creado):', idcreado);

        if (idcreado > 0) {
          this.router.navigate(['/login']);
        } else {
          this.errormensaje = "Hubo un problema. El backend devolvió ID 0.";
        }
      },
      error: (err) => {
        console.error('Error en la petición HTTP:', err);
        this.errormensaje = 'Hubo un fallo de comunicación con el servidor.';
      }
    });
  }
}
