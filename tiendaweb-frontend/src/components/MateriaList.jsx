import { useEffect, useState } from 'react'
import { apiEnviar, apiGet, comoLista, mensajeDeError } from '../data/api'
import Alert from './Alert'
import EmptyState from './EmptyState'
import MateriaCard from './MateriaCard'

function MateriaList({ user, aviso, onCreate, onEdit }) {
  const [materias, setMaterias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensajeOk, setMensajeOk] = useState('')
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let activo = true

    async function cargar() {
      setCargando(true)
      setError('')

      try {
        await apiEnviar('/GestionMaterias/SetUsuario?userid=' + user.idUsuario, 'PUT', {})
        const lista = await apiGet('/GestionMaterias/lista-materias')

        if (!activo) {
          return
        }

        setMaterias(comoLista(lista))
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

    cargar()

    return () => {
      activo = false
    }
  }, [user.idUsuario, recarga])

  async function eliminar(materia) {
    if (!materia.nombreMateria) {
      setError('Esta materia no tiene nombre. El servidor la identifica por el nombre y no se puede borrar.')
      return
    }

    setError('')
    setMensajeOk('')

    try {
      await apiEnviar(
        '/GestionMaterias/eliminar-materia/' + encodeURIComponent(materia.nombreMateria),
        'DELETE',
        {}
      )
      setMensajeOk('La materia "' + materia.nombreMateria + '" se eliminó.')
      setRecarga(recarga + 1)
    } catch (err) {
      setError(mensajeDeError(err))
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Materias
          </h2>
          <p className="text-gray-400 mt-1">
            La prioridad va de 1 (baja) a 10 (alta) y se usa en la matriz.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="bg-proton text-white px-5 py-3 rounded-lg hover:bg-proton-dark transition"
        >
          Nueva materia
        </button>
      </div>

      {cargando ? <p className="text-proton-light mb-4">Cargando materias...</p> : null}

      <Alert tipo="exito" mensaje={aviso} />
      <Alert tipo="exito" mensaje={mensajeOk} />
      <Alert tipo="error" mensaje={error} />

      {!cargando && !error && materias.length === 0 ? (
        <EmptyState
          titulo="No hay materias registradas"
          texto="Crea una materia para poder asignarla a una tarea."
        />
      ) : null}

      {materias.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {materias.map((materia) => (
            <MateriaCard
              key={materia.idMateria}
              materia={materia}
              onEdit={() => onEdit(materia)}
              onDelete={eliminar}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default MateriaList
