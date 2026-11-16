import { useEffect, useState } from 'react'
import { apiEnviar, apiGet, comoLista, mensajeDeError } from '../data/api'
import Alert from './Alert'
import EmptyState from './EmptyState'
import SubtaskCard from './SubtaskCard'

function SubtaskList({ user, tarea, aviso, onCreate, onBack }) {
  const [subtareas, setSubtareas] = useState([])
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
        // SetUser recibe el id en el cuerpo, no en la URL.
        await apiEnviar('/GestionSubtarea/SetUser', 'PUT', user.idUsuario)
        const lista = await apiGet('/GestionSubtarea/ListarSubtareas?idtarea=' + tarea.idTarea)

        if (!activo) {
          return
        }

        setSubtareas(comoLista(lista))
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
  }, [user.idUsuario, tarea.idTarea, recarga])

  async function eliminar(subtarea) {
    setError('')
    setMensajeOk('')

    try {
      await apiEnviar(
        '/GestionSubtarea/DeleteSubtarea?id=' + subtarea.idsubtarea,
        'DELETE',
        {}
      )
      setMensajeOk('La subtarea se eliminó.')
      setRecarga(recarga + 1)
    } catch (err) {
      setError(mensajeDeError(err))
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="text-proton-blue hover:underline mb-4"
      >
        Volver a tareas
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Subtareas
          </h2>
          <p className="text-gray-400 mt-1">
            De la tarea: {tarea.titulo || 'Sin título'}
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="bg-proton text-white px-5 py-3 rounded-lg hover:bg-proton-dark transition"
        >
          Nueva subtarea
        </button>
      </div>

      {cargando ? <p className="text-proton-light mb-4">Cargando subtareas...</p> : null}

      <Alert tipo="exito" mensaje={aviso} />
      <Alert tipo="exito" mensaje={mensajeOk} />
      <Alert tipo="error" mensaje={error} />

      {!cargando && !error && subtareas.length === 0 ? (
        <EmptyState
          titulo="No hay subtareas"
          texto="Agrega un paso concreto de esta tarea."
        />
      ) : null}

      {subtareas.length > 0 ? (
        <div className="grid gap-5">
          {subtareas.map((subtarea) => (
            <SubtaskCard
              key={subtarea.idsubtarea}
              subtarea={subtarea}
              tituloTarea={tarea.titulo}
              onDelete={eliminar}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default SubtaskList
