import { useEffect, useState } from 'react'
import { apiEnviar, apiGet, comoLista, mensajeDeError } from '../data/api'
import Alert from './Alert'
import EmptyState from './EmptyState'
import TaskCard from './TaskCard'

function nombreDeMateria(tarea, materias) {
  if (tarea.materia && tarea.materia.nombreMateria) {
    return tarea.materia.nombreMateria
  }

  const encontrada = materias.find((materia) => materia.idMateria === tarea.idMateria)

  if (encontrada) {
    return encontrada.nombreMateria
  }

  return 'Sin materia'
}

function TaskList({ user, aviso, onCreate, onEdit, onOpenSubtasks }) {
  const [pendientes, setPendientes] = useState([])
  const [completadas, setCompletadas] = useState([])
  const [vencidas, setVencidas] = useState([])
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
        await apiEnviar('/GestionTareas/SETUSUARIO?usuario=' + user.idUsuario, 'POST', {})
        await apiEnviar('/GestionMaterias/SetUsuario?userid=' + user.idUsuario, 'PUT', {})

        const listaPendientes = await apiGet('/GestionTareas/Listar-Tareas')
        const listaCompletadas = await apiGet('/GestionTareas/ConseguirTareasCompletadas')
        const listaVencidas = await apiGet('/GestionTareas/traertareaspasadas')
        const listaMaterias = await apiGet('/GestionMaterias/lista-materias')

        if (!activo) {
          return
        }

        setPendientes(comoLista(listaPendientes))
        setCompletadas(comoLista(listaCompletadas))
        setVencidas(comoLista(listaVencidas))
        setMaterias(comoLista(listaMaterias))
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

  async function eliminar(tarea) {
    if (!tarea.titulo) {
      setError('Esta tarea no tiene título. El servidor la identifica por el título y no se puede borrar.')
      return
    }

    setError('')
    setMensajeOk('')

    try {
      await apiEnviar(
        '/GestionTareas/Eliminar-Tarea/' + encodeURIComponent(tarea.titulo),
        'DELETE',
        {}
      )
      setMensajeOk('La tarea "' + tarea.titulo + '" se eliminó.')
      setRecarga(recarga + 1)
    } catch (err) {
      setError(mensajeDeError(err))
    }
  }

  async function completar(tarea) {
    setError('')
    setMensajeOk('')

    try {
      await apiEnviar(
        '/GestionTareas/MarcarCompletado?tareaid=' + tarea.idTarea,
        'PUT',
        {}
      )
      setMensajeOk('Se actualizó el estado de "' + (tarea.titulo || 'la tarea') + '".')
      setRecarga(recarga + 1)
    } catch (err) {
      setError(mensajeDeError(err))
    }
  }

  function renderGrupo(titulo, ayuda, tareas, textoCompletar) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {titulo}
            </h2>
            <p className="text-gray-400 mt-1">
              {ayuda}
            </p>
          </div>

          <span className="text-sm text-gray-400">
            Total: {tareas.length}
          </span>
        </div>

        {!cargando && !error && tareas.length === 0 ? (
          <EmptyState
            titulo={'No hay ' + titulo.toLowerCase()}
            texto="Cuando existan, van a aparecer en esta sección."
          />
        ) : null}

        {tareas.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {tareas.map((tarea) => (
              <TaskCard
                key={tarea.idTarea}
                tarea={tarea}
                nombreMateria={nombreDeMateria(tarea, materias)}
                textoCompletar={textoCompletar}
                onEdit={() => onEdit(tarea)}
                onDelete={eliminar}
                onComplete={() => completar(tarea)}
                onOpenSubtasks={() => onOpenSubtasks(tarea)}
              />
            ))}
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Mis tareas
          </h2>
          <p className="text-gray-400 mt-1">
            Pendientes, completadas y vencidas de tu cuenta.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="bg-proton text-white px-5 py-3 rounded-lg hover:bg-proton-dark transition"
        >
          Nueva tarea
        </button>
      </div>

      {cargando ? (
        <p className="text-proton-light mb-4">
          {pendientes.length === 0 && completadas.length === 0 && vencidas.length === 0
            ? 'Cargando tareas...'
            : 'Actualizando...'}
        </p>
      ) : null}

      <Alert tipo="exito" mensaje={aviso} />
      <Alert tipo="exito" mensaje={mensajeOk} />
      <Alert tipo="error" mensaje={error} />

      {(!error || pendientes.length + completadas.length + vencidas.length > 0) ? (
        <>
          {renderGrupo(
            'Tareas pendientes',
            'Entregas que todavía están a tiempo.',
            pendientes,
            'Marcar completada'
          )}

          {renderGrupo(
            'Tareas completadas',
            'Las que ya marcaste como terminadas.',
            completadas,
            'Desmarcar'
          )}

          {renderGrupo(
            'Tareas vencidas',
            'La fecha ya pasó o el estado es vencida.',
            vencidas,
            'Cambiar a pendiente'
          )}
        </>
      ) : null}
    </div>
  )
}

export default TaskList
