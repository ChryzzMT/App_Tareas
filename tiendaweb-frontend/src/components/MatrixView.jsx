import { useEffect, useState } from 'react'
import { apiEnviar, apiGet, comoLista, mensajeDeError } from '../data/api'
import Alert from './Alert'
import Quadrant from './Quadrant'

function MatrixView({ user }) {
  const [oportunidades, setOportunidades] = useState([])
  const [gananciaRapida, setGananciaRapida] = useState([])
  const [menorGanancia, setMenorGanancia] = useState([])
  const [descartar, setDescartar] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarMatriz() {
      setCargando(true)
      setError('')

      try {
        await apiEnviar('/GestionImpactoEsfuerzo/SetUser?id=' + user.idUsuario, 'PUT', {})
        await apiEnviar('/GestionImpactoEsfuerzo/asignar-impactoesfuerzo', 'PUT', {})

        const listaOportunidades = await apiGet('/GestionImpactoEsfuerzo/tareas-oportunidades')
        const listaRapida = await apiGet('/GestionImpactoEsfuerzo/tareas-gananciarapida')
        const listaMenor = await apiGet('/GestionImpactoEsfuerzo/tareas-menorgan')
        const listaDescartar = await apiGet('/GestionImpactoEsfuerzo/tareas-descartar')

        if (!activo) {
          return
        }

        setOportunidades(comoLista(listaOportunidades))
        setGananciaRapida(comoLista(listaRapida))
        setMenorGanancia(comoLista(listaMenor))
        setDescartar(comoLista(listaDescartar))
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

    cargarMatriz()

    return () => {
      activo = false
    }
  }, [user.idUsuario])

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">
        Matriz de impacto y esfuerzo
      </h2>

      <p className="text-gray-400 mt-1 mb-6">
        Solo entran las tareas activas cuya fecha todavía no pasó.
        El cuadrante sale de la prioridad de la materia y del peso de la tarea.
      </p>

      {cargando ? <p className="text-proton-light mb-4">Calculando la matriz...</p> : null}

      <Alert tipo="error" mensaje={error} />

      <div className="grid gap-4 md:grid-cols-2">
        <Quadrant
          titulo="Oportunidades"
          ayuda="Prioridad de materia 8 a 10 y peso 1, 2 o 3."
          tareas={oportunidades}
          clase="bg-proton/10 border-proton/40"
        />

        <Quadrant
          titulo="Ganancia rápida"
          ayuda="Peso 5, 8 o 13 y prioridad de materia 4 o más."
          tareas={gananciaRapida}
          clase="bg-proton-blue/10 border-proton-blue/40"
        />

        <Quadrant
          titulo="Menor ganancia"
          ayuda="Prioridad 4 a 7 y peso 2 o 3."
          tareas={menorGanancia}
          clase="bg-panel border-line"
        />

        <Quadrant
          titulo="Descartar"
          ayuda="El resto: prioridad baja, o peso 1 con prioridad media."
          tareas={descartar}
          clase="bg-ink border-line"
        />
      </div>
    </div>
  )
}

export default MatrixView
