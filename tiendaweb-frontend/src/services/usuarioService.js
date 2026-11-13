import { apiGet, apiPost } from './apiClient';

export function iniciarSesion(email, contrasena) {
  const ruta = `/GestionUsuario/VerificarUsuario?m=${encodeURIComponent(email)}&c=${encodeURIComponent(contrasena)}`;
  return apiGet(ruta);
}

export function crearCuenta({ nombre, email, contrasena }) {
  return apiPost('/GestionUsuario/CrearUsuario', {
    idUsuario: 0,
    nombre: nombre.trim(),
    email: email.trim(),
    contrasena,
  });
}
