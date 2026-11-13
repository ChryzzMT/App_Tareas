import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';

export function establecerUsuarioTareas(usuarioId) {
  return apiPost(`/GestionTareas/SETUSUARIO?usuario=${encodeURIComponent(usuarioId)}`);
}

export function listarPendientes() {
  return apiGet('/GestionTareas/Listar-Tareas');
}

export function listarCompletadas() {
  return apiGet('/GestionTareas/ConseguirTareasCompletadas');
}

/** También marca como vencidas las pendientes cuya fecha ya pasó. */
export function listarVencidas() {
  return apiGet('/GestionTareas/traertareaspasadas');
}

export function listarParaRevision() {
  return apiGet('/GestionTareas/MostrarPorPrioridad');
}

export function cuerpoTarea(tarea, usuarioId) {
  return {
    idTarea: Number(tarea.idTarea) || 0,
    titulo: tarea.titulo.trim(),
    descripcion: tarea.descripcion.trim(),
    pesoTarea: Number(tarea.pesoTarea),
    fechaEntrega: tarea.fechaEntrega,
    estado: tarea.estado,
    idMateria: Number(tarea.idMateria),
    idUsuario: Number(usuarioId) || 0,
  };
}

export function crearTarea(tarea, usuarioId) {
  return apiPost('/GestionTareas/Crear-Tarea', cuerpoTarea(tarea, usuarioId));
}

export function actualizarTarea(tarea, usuarioId) {
  return apiPut('/GestionTareas/Actualizar-Todo', cuerpoTarea(tarea, usuarioId));
}

export function eliminarTareaPorTitulo(titulo) {
  return apiDelete(`/GestionTareas/Eliminar-Tarea/${encodeURIComponent(titulo)}`);
}

export function marcarCompletada(idTarea) {
  return apiPut(`/GestionTareas/MarcarCompletado?tareaid=${encodeURIComponent(idTarea)}`);
}
