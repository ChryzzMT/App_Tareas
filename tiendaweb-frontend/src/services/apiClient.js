import { API_BASE } from './config';

function mensajeEstado(estado) {
  if (estado === 404) {
    return 'El servidor no encontró lo que pedimos. Comprueba que el backend esté en marcha y vuelve a intentar.';
  }
  if (estado >= 500) {
    return 'El servidor no pudo completar la acción. Revisa los datos e inténtalo de nuevo en unos segundos.';
  }
  return 'No se pudo completar la acción. Revisa los campos e inténtalo otra vez.';
}

async function leerCuerpo(respuesta) {
  const texto = await respuesta.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

/**
 * Sustituye al ApiClient de Angular (get, post, put, delete).
 * Las respuestas vacías de los métodos void del backend se tratan como null.
 */
export async function solicitar(ruta, { method = 'GET', body } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE}${ruta}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Ábrelo en el puerto 5056 y vuelve a intentar.');
  }

  const datos = await leerCuerpo(respuesta);
  if (!respuesta.ok) {
    throw new Error(mensajeEstado(respuesta.status));
  }
  return datos;
}

export const apiGet = (ruta) => solicitar(ruta);
export const apiPost = (ruta, body = {}) => solicitar(ruta, { method: 'POST', body });
export const apiPut = (ruta, body = {}) => solicitar(ruta, { method: 'PUT', body });
export const apiDelete = (ruta) => solicitar(ruta, { method: 'DELETE' });
