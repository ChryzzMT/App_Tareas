import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';

export function establecerUsuarioMaterias(usuarioId) {
  return apiPut(`/GestionMaterias/SetUsuario?userid=${encodeURIComponent(usuarioId)}`);
}

export function listarMaterias() {
  return apiGet('/GestionMaterias/lista-materias');
}

export function crearMateria(materia, usuarioId) {
  return apiPost('/GestionMaterias/agregar-materia', {
    idMateria: 0,
    nombreMateria: materia.nombreMateria.trim(),
    prioridadMateria: Number(materia.prioridadMateria),
    idUsuario: Number(usuarioId) || 0,
  });
}

export function actualizarMateria(materia, usuarioId) {
  return apiPut('/GestionMaterias/actualizar', {
    idMateria: Number(materia.idMateria) || 0,
    nombreMateria: materia.nombreMateria.trim(),
    prioridadMateria: Number(materia.prioridadMateria),
    idUsuario: Number(materia.idUsuario || usuarioId) || 0,
  });
}

export function eliminarMateria(nombre) {
  return apiDelete(`/GestionMaterias/eliminar-materia/${encodeURIComponent(nombre)}`);
}
