export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const CABECERA_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** El calendario original empieza en lunes. Domingo (0) queda en la última columna. */
export function desplazamientoPrimeraSemana(dias) {
  if (!dias?.length) return 0;
  const primerDia = Number(dias[0].diadelsemana);
  if (Number.isNaN(primerDia)) return 0;
  return primerDia === 0 ? 6 : primerDia - 1;
}

export function moverMes(year, mes, delta) {
  const fecha = new Date(year, mes - 1 + delta, 1);
  return { year: fecha.getFullYear(), mes: fecha.getMonth() + 1 };
}
