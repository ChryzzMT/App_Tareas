import { PESOS } from './priorizacion';
import { fechaValida } from './fechas';

const ESTADOS_ELEGIBLES = ['Pendiente', 'Activa', 'Completada', 'Vencida'];

export function tieneErrores(errores) {
  return Object.keys(errores).length > 0;
}

export function validarTarea(formulario) {
  const errores = {};
  const titulo = formulario.titulo?.trim() || '';

  if (!titulo) {
    errores.titulo = 'Escribe un título. Así podrás reconocer la tarea en la lista y en el calendario.';
  } else if (titulo.includes('/')) {
    errores.titulo = 'Quita la barra / del título. El sistema guarda la eliminación usando el título y esa barra lo rompe.';
  } else if (titulo.length > 150) {
    errores.titulo = 'Acorta el título a 150 caracteres para que se lea en la tarjeta.';
  }

  if (!formulario.descripcion?.trim()) {
    errores.descripcion = 'Añade una descripción breve de lo que hay que hacer.';
  } else if (formulario.descripcion.trim().length > 500) {
    errores.descripcion = 'La descripción admite hasta 500 caracteres. Deja el detalle largo en las subtareas.';
  }

  if (!PESOS.includes(Number(formulario.pesoTarea))) {
    errores.pesoTarea = 'Elige un peso: 1, 2, 3, 5, 8 o 13. Mide el esfuerzo, no la importancia de la materia.';
  }

  if (!formulario.fechaEntrega) {
    errores.fechaEntrega = 'Indica día y hora de entrega. Sin fecha la tarea no entra en el calendario ni en la matriz.';
  } else if (!fechaValida(formulario.fechaEntrega)) {
    errores.fechaEntrega = 'Esa fecha no es válida. Ábrela con el calendario del campo y elige otra.';
  }

  if (!ESTADOS_ELEGIBLES.includes(formulario.estado)) {
    errores.estado = 'Elige Pendiente, Activa o Completada. Vencida la pone el sistema cuando se pasa la fecha.';
  }

  if (!formulario.idMateria) {
    errores.idMateria = 'Elige una materia. Sin ella no se puede calcular si la tarea es oportunidad, ganancia o descarte.';
  }

  return errores;
}

export function avisoFecha(formulario, ahora = new Date()) {
  if (!fechaValida(formulario.fechaEntrega)) return '';
  if (new Date(formulario.fechaEntrega) >= ahora) return '';
  if (formulario.estado === 'Pendiente') {
    return 'La fecha ya pasó. Al actualizar la lista, el sistema la marcará como vencida. Elige una fecha futura si todavía debes hacerla.';
  }
  if (formulario.estado === 'Activa') {
    return 'Una tarea activa con fecha pasada no aparece ni en pendientes ni en vencidas. Ponla en Pendiente para que el sistema la marque vencida, o elige una fecha futura.';
  }
  return '';
}

export function validarMateria(formulario) {
  const errores = {};
  const nombre = formulario.nombreMateria?.trim() || '';
  if (!nombre) {
    errores.nombreMateria = 'Escribe el nombre de la materia, por ejemplo Cálculo II.';
  } else if (nombre.length > 80) {
    errores.nombreMateria = 'Usa un nombre de hasta 80 caracteres.';
  }

  const prioridad = Number(formulario.prioridadMateria);
  if (!Number.isInteger(prioridad) || prioridad < 1 || prioridad > 10) {
    errores.prioridadMateria = 'La prioridad va de 1 (poco importante) a 10 (imprescindible). De 8 en adelante cuenta como alto impacto.';
  }
  return errores;
}

export function validarCuenta(formulario) {
  const errores = {};
  if (!formulario.nombre?.trim()) {
    errores.nombre = 'Escribe tu nombre. Aparecerá en el encabezado al entrar.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email?.trim() || '')) {
    errores.email = 'El correo debe tener la forma nombre@dominio.com.';
  }
  const largo = formulario.contrasena?.length || 0;
  if (largo < 8 || largo > 18) {
    errores.contrasena = 'La contraseña debe tener entre 8 y 18 caracteres.';
  }
  return errores;
}

export function validarAcceso(formulario) {
  const errores = {};
  if (!formulario.email?.trim() || !formulario.contrasena) {
    errores.general = 'Por favor, llena el correo y la contraseña.';
  }
  return errores;
}

export function validarSubtarea(descripcion) {
  const texto = descripcion?.trim() || '';
  if (!texto) return 'Escribe qué hay que hacer en esta subtarea.';
  if (texto.length > 300) return 'Acorta la subtarea a 300 caracteres.';
  return '';
}
