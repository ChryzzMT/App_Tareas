import { useEffect, useState } from 'react'
import { apiEnviar, apiGet, mensajeDeError } from '../data/api'
import { numeroDiaSemana } from '../data/fechas'
import Alert from './Alert'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

function CalendarView({ user }) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [dias, setDias] = useState([])
  const [vacios, setVacios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarMes() {
      setCargando(true)
      setError('')

      try {
        await apiEnviar('/GestionCalendario/setuserid?id=' + user.idUsuario, 'PUT', {})
        await apiEnviar('/GestionCalendario/RefrescarCalendario', 'PUT', {})

        const data = await apiGet(
          '/GestionCalendario/ObtenerDiasdeunMes?year=' + anio + '&mes=' + mes
        )

        if (!activo) {
          return
        }

        if (!data || !data.listaDias || data.listaDias.length === 0) {
          setDias([])
          setVacios([])
          setError('No hay calendario para ese año. El servidor guarda el año actual y los cinco siguientes.')
          return
        }

        const primerDia = numeroDiaSemana(data.listaDias[0].diadelsemana)
        const offset = primerDia === 0 ? 6 : primerDia - 1

        setDias(data.listaDias)
        setVacios(Array(offset).fill(0))
      } catch (err) {
        if (activo) {
          setError(mensajeDeError(err))
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarMes()

    return () => {
      activo = false
    }
  }, [user.idUsuario, mes, anio])

  function mesAnterior() {
    if (mes === 1) {
      setMes(12)
      setAnio(anio - 1)
    } else {
      setMes(mes - 1)
    }
  }

  function mesSiguiente() {
    if (mes === 12) {
      setMes(1)
      setAnio(anio + 1)
    } else {
      setMes(mes + 1)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={mesAnterior}
          className="border border-line text-gray-200 px-4 py-2 rounded-lg hover:bg-white/5 transition"
        >
          ← Anterior
        </button>

        <h2 className="text-2xl font-bold text-white text-center">
          {MESES[mes - 1]} {anio}
        </h2>

        <button
          type="button"
          onClick={mesSiguiente}
          className="border border-proton-blue text-proton-blue px-4 py-2 rounded-lg hover:bg-proton-blue/10 transition"
        >
          Siguiente →
        </button>
      </div>

      {cargando ? <p className="text-proton-light mb-4">Cargando calendario...</p> : null}

      <Alert tipo="error" mensaje={error} />

      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm text-gray-400 mb-1">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((nombre) => (
          <div key={nombre} className="py-2 font-medium">
            {nombre}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {vacios.map((_, indice) => (
          <div key={'vacio-' + indice} className="min-h-16 sm:min-h-24" />
        ))}

        {dias.map((dia) => {
          const esHoy = dia.dia === hoy.getDate()
            && mes === hoy.getMonth() + 1
            && anio === hoy.getFullYear()
          const tareasDia = dia.listaTareaDia || []

          return (
            <div
              key={dia.dia}
              className={
                'min-h-16 sm:min-h-24 border rounded-lg p-1 sm:p-2 '
                + (esHoy
                  ? 'border-proton bg-proton/15'
                  : 'border-line bg-panel')
              }
            >
              <div className={'text-sm font-semibold ' + (esHoy ? 'text-proton-light' : 'text-white')}>
                {dia.dia}
              </div>

              {tareasDia.map((tarea) => (
                <p
                  key={tarea.idTarea}
                  className="mt-1 rounded bg-proton-blue/20 text-sky-100 px-1 py-0.5 text-left text-[10px] sm:text-xs leading-tight break-words"
                >
                  {tarea.titulo}
                </p>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarView
