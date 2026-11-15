// Habla con el backend que ya existe.
// Es el reemplazo simple de ApiClient (get, post, put, delete).
// Se usa fetch, que viene con el navegador: no hace falta axios.

export const API_URL = 'http://localhost:5056'

async function leerRespuesta(respuesta) {
  if (!respuesta.ok) {
    throw new Error('El servidor respondió con un error (' + respuesta.status + ').')
  }

  // 204 = la operación salió bien y no hay cuerpo (por ejemplo, un login fallido).
  if (respuesta.status === 204) {
    return null
  }

  const texto = await respuesta.text()

  if (!texto) {
    return null
  }

  return JSON.parse(texto)
}

export async function apiGet(ruta) {
  const respuesta = await fetch(API_URL + ruta)
  return leerRespuesta(respuesta)
}

export async function apiEnviar(ruta, metodo, cuerpo) {
  const respuesta = await fetch(API_URL + ruta, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cuerpo)
  })

  return leerRespuesta(respuesta)
}

export function comoLista(datos) {
  if (Array.isArray(datos)) {
    return datos
  }

  return []
}

export function mensajeDeError(error) {
  if (error && error.message && error.message.includes('respondió')) {
    return error.message + ' Inténtalo de nuevo.'
  }

  return 'No se pudo conectar con el servidor. Revisa que el backend esté encendido en http://localhost:5056.'
}
