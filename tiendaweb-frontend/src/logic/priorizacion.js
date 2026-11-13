import { esAnteriorAAhora, esPosteriorAHoy, inicioDelDia } from './fechas';

/**
 * Réplica legible de GestionImpactoEsfuerzo.AsignarTareasEsfuerzo_Impacto.
 * El servidor sigue siendo quien clasifica la matriz. Esta función existe
 * para mostrar la misma regla en cada tarjeta y para poder probarla.
 */

export const PESOS = [1, 2, 3, 5, 8, 13];

export const CUADRANTES = {
  oportunidades: {
    id: 'oportunidades',
    nombre: 'Oportunidades',
    forma: 'diamante',
    explicacion: 'La materia importa mucho y la tarea pide poco esfuerzo. Conviene hacerla pronto.',
  },
  ganancia_rapida: {
    id: 'ganancia_rapida',
    nombre: 'Ganancia rápida',
    forma: 'triangulo',
    explicacion: 'Pide más esfuerzo, pero la materia sigue siendo importante.',
  },
  menor_ganancia: {
    id: 'menor_ganancia',
    nombre: 'Menor ganancia',
    forma: 'cuadrado',
    explicacion: 'Impacto medio y esfuerzo bajo. Sirve, pero no va primero.',
  },
  minima: {
    id: 'minima',
    nombre: 'Descartar',
    forma: 'circulo',
    explicacion: 'Poco impacto, o el esfuerzo no compensa. En el sistema original este grupo es la mínima ganancia.',
  },
};

export const ORDEN_MATRIZ = ['oportunidades', 'ganancia_rapida', 'menor_ganancia', 'minima'];

export const RANGO_IMPORTANCIA = {
  oportunidades: 0,
  ganancia_rapida: 1,
  menor_ganancia: 2,
  minima: 3,
};

export const ESTADOS = {
  pendiente: { id: 'pendiente', nombre: 'Pendiente', simbolo: '⏳' },
  activa: { id: 'activa', nombre: 'Activa', simbolo: '▶' },
  completada: { id: 'completada', nombre: 'Completada', simbolo: '✓' },
  vencida: { id: 'vencida', nombre: 'Vencida', simbolo: '!' },
};

export const EXPLICACION_REGLA = [
  'La prioridad sale de dos datos visibles: la importancia de la materia (1 a 10) y el peso de la tarea (1, 2, 3, 5, 8 o 13).',
  'Oportunidades: materia 8, 9 o 10 y peso 1, 2 o 3.',
  'Ganancia rápida: peso 5, 8 o 13 en una materia de prioridad 4 o más.',
  'Menor ganancia: materia de 4 a 7 y peso 2 o 3.',
  'Descartar, o mínima ganancia: el resto de las tareas abiertas con fecha posterior a hoy.',
  'Las completadas y las vencidas no entran en la matriz. Si devuelves una de ellas a pendiente, la entrega pasa a dentro de cinco días.',
];

export function normalizarEstado(estado) {
  return String(estado || '').trim().toLowerCase();
}

export function nombreEstado(estado) {
  const id = normalizarEstado(estado);
  return ESTADOS[id]?.nombre || (estado ? String(estado) : 'Sin estado');
}

export function materiaDe(materias, tarea) {
  if (!tarea) return null;
  const encontrada = (materias || []).find(
    (materia) => Number(materia.idMateria) === Number(tarea.idMateria),
  );
  return encontrada || tarea.materia || null;
}

function comparacionDefinida(valor, operador, umbral) {
  if (valor === null || valor === undefined || valor === '') return false;
  const numero = Number(valor);
  if (Number.isNaN(numero)) return false;
  if (operador === '<=') return numero <= umbral;
  if (operador === '>=') return numero >= umbral;
  if (operador === '===') return numero === umbral;
  return false;
}

/** Entran tareas no completadas, no vencidas y con entrega posterior al inicio de hoy. */
export function entraEnMatriz(tarea, ahora = new Date()) {
  if (!tarea) return false;
  const estado = normalizarEstado(tarea.estado);
  if (estado === 'completada' || estado === 'vencida') return false;
  return esPosteriorAHoy(tarea.fechaEntrega, ahora);
}

export function clasificarTarea(tarea, materia, ahora = new Date()) {
  if (!materia || !entraEnMatriz(tarea, ahora)) return null;

  const prioridad = materia.prioridadMateria;
  const peso = tarea.pesoTarea;
  let cuadrante = null;
  let asignada = false;

  if (comparacionDefinida(prioridad, '>=', 8)) {
    if (comparacionDefinida(peso, '<=', 3)) {
      cuadrante = 'oportunidades';
      asignada = true;
    } else if (comparacionDefinida(peso, '>=', 5)) {
      cuadrante = 'ganancia_rapida';
      asignada = true;
    }
  } else if (comparacionDefinida(prioridad, '>=', 4)) {
    if (comparacionDefinida(peso, '>=', 5)) {
      cuadrante = 'ganancia_rapida';
      asignada = true;
    } else if (comparacionDefinida(peso, '===', 2) || comparacionDefinida(peso, '===', 3)) {
      cuadrante = 'menor_ganancia';
      asignada = true;
    }
  } else if (comparacionDefinida(prioridad, '>=', 1)) {
    if (comparacionDefinida(peso, '>=', 5)) {
      cuadrante = 'minima';
      asignada = true;
    }
  }

  if (!asignada) cuadrante = 'minima';
  return cuadrante;
}

/**
 * Misma decisión que MarcarCompletado en el servidor.
 * El cliente no la aplica por su cuenta: llama a la API y vuelve a leer.
 */
export function estadoTrasMarcar(tarea, ahora = new Date()) {
  const estado = normalizarEstado(tarea?.estado);
  if (estado === 'completada' || estado === 'vencida') {
    const fecha = inicioDelDia(ahora);
    fecha.setDate(fecha.getDate() + 5);
    return { estado: 'Pendiente', fechaEntrega: fecha };
  }
  return { estado: 'Completada', fechaEntrega: tarea?.fechaEntrega };
}

/** Lista "pendientes" del servidor: ni completada ni vencida, y entrega posterior a ahora. */
export function esTareaEnCurso(tarea, ahora = new Date()) {
  const estado = normalizarEstado(tarea?.estado);
  if (estado === 'completada' || estado === 'vencida') return false;
  if (!tarea?.fechaEntrega) return false;
  return new Date(tarea.fechaEntrega) > ahora;
}

/** El servidor marca vencida si ya lo está, o si está pendiente y la fecha ya pasó. */
export function esCandidataAVencida(tarea, ahora = new Date()) {
  const estado = normalizarEstado(tarea?.estado);
  if (estado === 'vencida') return true;
  return estado === 'pendiente' && esAnteriorAAhora(tarea?.fechaEntrega, ahora);
}

export function resumir(pendientes, completadas, vencidas, materias, ahora = new Date()) {
  const porCuadrante = {
    oportunidades: 0,
    ganancia_rapida: 0,
    menor_ganancia: 0,
    minima: 0,
  };

  (pendientes || []).forEach((tarea) => {
    const cuadrante = clasificarTarea(tarea, materiaDe(materias, tarea), ahora);
    if (cuadrante) porCuadrante[cuadrante] += 1;
  });

  const proxima = [...(pendientes || [])]
    .filter((tarea) => tarea.fechaEntrega)
    .sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega))[0] || null;

  return {
    curso: (pendientes || []).length,
    completadas: (completadas || []).length,
    vencidas: (vencidas || []).length,
    porCuadrante,
    proxima,
  };
}
