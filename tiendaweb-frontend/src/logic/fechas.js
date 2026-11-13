export function inicioDelDia(fecha) {
  const dia = new Date(fecha);
  dia.setHours(0, 0, 0, 0);
  return dia;
}

export function fechaValida(valor) {
  if (!valor) return false;
  const fecha = new Date(valor);
  return !Number.isNaN(fecha.getTime());
}

export function formatearFecha(valor) {
  if (!fechaValida(valor)) return 'Sin fecha';
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(valor));
}

/** Valor para un input datetime-local a partir de lo que devuelve la API. */
export function aFechaLocal(valor) {
  if (!fechaValida(valor)) return '';
  const fecha = new Date(valor);
  const dos = (numero) => String(numero).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}T${dos(fecha.getHours())}:${dos(fecha.getMinutes())}`;
}

export function esPosteriorAHoy(valor, ahora = new Date()) {
  if (!fechaValida(valor)) return false;
  return new Date(valor) > inicioDelDia(ahora);
}

export function esAnteriorAAhora(valor, ahora = new Date()) {
  if (!fechaValida(valor)) return false;
  return new Date(valor) < ahora;
}
