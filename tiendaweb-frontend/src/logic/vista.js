import { clasificarTarea, materiaDe, normalizarEstado, RANGO_IMPORTANCIA } from './priorizacion';

export const FILTROS_INICIALES = {
  texto: '',
  mostrar: 'todas',
  materia: 'todas',
  cuadrante: 'todos',
  orden: 'servidor',
};

export function hayFiltroActivo(filtros) {
  return Boolean(
    filtros.texto.trim()
    || filtros.mostrar !== 'todas'
    || filtros.materia !== 'todas'
    || filtros.cuadrante !== 'todos'
    || filtros.orden !== 'servidor',
  );
}

function coincide(tarea, filtros, materias, ahora) {
  const materia = materiaDe(materias, tarea);
  const nombre = materia?.nombreMateria || '';
  const texto = filtros.texto.trim().toLowerCase();
  if (texto) {
    const bolsa = `${tarea.titulo || ''} ${tarea.descripcion || ''} ${nombre}`.toLowerCase();
    if (!bolsa.includes(texto)) return false;
  }
  if (filtros.materia !== 'todas' && Number(tarea.idMateria) !== Number(filtros.materia)) return false;
  if (filtros.cuadrante !== 'todos') {
    const cuadrante = clasificarTarea(tarea, materia, ahora);
    if (filtros.cuadrante === 'sin_cuadrante') {
      if (cuadrante) return false;
    } else if (cuadrante !== filtros.cuadrante) return false;
  }
  if (filtros.mostrar === 'pendiente' || filtros.mostrar === 'activa') {
    if (normalizarEstado(tarea.estado) !== filtros.mostrar) return false;
  }
  return true;
}

function ordenar(lista, orden, materias, ahora) {
  if (orden === 'servidor') return lista;
  const copia = [...lista];
  copia.sort((a, b) => {
    if (orden === 'peso') return Number(b.pesoTarea) - Number(a.pesoTarea);
    if (orden === 'fecha') return new Date(a.fechaEntrega) - new Date(b.fechaEntrega);
    if (orden === 'fecha_lejana') return new Date(b.fechaEntrega) - new Date(a.fechaEntrega);
    const rangoA = RANGO_IMPORTANCIA[clasificarTarea(a, materiaDe(materias, a), ahora)] ?? 99;
    const rangoB = RANGO_IMPORTANCIA[clasificarTarea(b, materiaDe(materias, b), ahora)] ?? 99;
    if (rangoA !== rangoB) return rangoA - rangoB;
    return new Date(a.fechaEntrega) - new Date(b.fechaEntrega);
  });
  return copia;
}

export function prepararLista(lista, filtros, materias, ahora = new Date()) {
  const filtrada = (lista || []).filter((tarea) => coincide(tarea, filtros, materias, ahora));
  return ordenar(filtrada, filtros.orden, materias, ahora);
}

export function seccionesVisibles(filtros) {
  if (filtros.mostrar === 'curso' || filtros.mostrar === 'pendiente' || filtros.mostrar === 'activa') {
    return ['curso'];
  }
  if (filtros.mostrar === 'completadas') return ['completadas'];
  if (filtros.mostrar === 'vencidas') return ['vencidas'];
  if (filtros.mostrar === 'revisar') return ['revisar'];
  return ['curso', 'completadas', 'vencidas', 'revisar'];
}
