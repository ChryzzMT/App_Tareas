// El backend manda fechas en formato ISO. Estas funciones las preparan para la pantalla.

export function formatearFecha(valor) {
  if (!valor) {
    return 'Sin fecha'
  }

  const fecha = new Date(valor)

  if (Number.isNaN(fecha.getTime())) {
    return 'Sin fecha'
  }

  return fecha.toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

// El input datetime-local solo acepta "YYYY-MM-DDTHH:mm".
export function aFechaInput(valor) {
  if (!valor) {
    return ''
  }

  const fecha = new Date(valor)

  if (Number.isNaN(fecha.getTime())) {
    return ''
  }

  const dos = (numero) => String(numero).padStart(2, '0')

  return fecha.getFullYear()
    + '-' + dos(fecha.getMonth() + 1)
    + '-' + dos(fecha.getDate())
    + 'T' + dos(fecha.getHours())
    + ':' + dos(fecha.getMinutes())
}

// DayOfWeek de .NET: 0 es domingo. A veces puede llegar como texto.
export function numeroDiaSemana(valor) {
  if (typeof valor === 'number') {
    return valor
  }

  const nombres = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  }

  if (nombres[valor] !== undefined) {
    return nombres[valor]
  }

  return 1
}
