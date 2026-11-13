import { apiDelete, apiGet, apiPost, apiPut, solicitar } from './apiClient';

export function establecerUsuarioSubtareas(usuarioId) {
  return solicitar('/GestionSubtarea/SetUser', {
    method: 'PUT',
    body: Number(usuarioId),
  });
}

export function listarSubtareas(idTarea) {
  return apiGet(`/GestionSubtarea/ListarSubtareas?idtarea=${encodeURIComponent(idTarea)}`);
}

export function crearSubtarea(idTarea, descripcion) {
  const ruta = `/GestionSubtarea/CreateSubtarea?tareaid=${encodeURIComponent(idTarea)}&descripcion=${encodeURIComponent(descripcion)}`;
  return apiPost(ruta);
}

export function eliminarSubtarea(id) {
  return apiDelete(`/GestionSubtarea/DeleteSubtarea?id=${encodeURIComponent(id)}`);
}

export function actualizarDescripcionSubtarea(id, descripcion) {
  const ruta = `/GestionSubtarea/ActualizarDescripcion?id=${encodeURIComponent(id)}&descripcion=${encodeURIComponent(descripcion)}`;
  return apiPut(ruta);
}
