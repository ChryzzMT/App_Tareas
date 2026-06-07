import { Component, inject } from '@angular/core';
import { usuario } from '../Login/Usuario';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // 🎯 Importamos el cliente nativo
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './crearcuenta.html',
})
export class CrearCuenta {

  // 🎯 Asegúrate de que las propiedades coincidan con C# (Mayúsculas/Minúsculas)
  Usuario: usuario = {
    idUsuario: 0,
    nombre: "", // Si en tu interfaz 'usuario' está en minúscula, déjalo así aquí
    email: "",
    contrasena: ""
  };

  errormensaje: string = "";
  private url = 'http://localhost:5056/GestionUsuario/CrearUsuario';

  // Inyectamos el HttpClient nativo de Angular para asegurar el tiro
  private http = inject(HttpClient);

  constructor(private router: Router) {}

  crearcuenta(): void {
    this.errormensaje = "";

    if (!this.Usuario.email || !this.Usuario.contrasena || !this.Usuario.nombre) {
      this.errormensaje = "Rellene los campos por favor";
      return;
    }

    // 🎯 Mapeo explícito antes de enviar:
    // Creamos un objeto con las llaves EXACTAS que tiene tu clase Usuario en C#
    const dataParaEnviar = {
      IdUsuario: 0,
      Nombre: this.Usuario.nombre,
      Email: this.Usuario.email,
      Contrasena: this.Usuario.contrasena
    };

    console.log("Enviando este JSON al backend:", dataParaEnviar);

    // Hacemos el POST directo con el cliente nativo
    this.http.post<number>(this.url, dataParaEnviar).subscribe({
      next: (idcreado: number) => {
        console.log('Respuesta de .NET (ID creado):', idcreado);

        if (idcreado > 0) {
          // Éxito: Nos movemos al login
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
