import { useState } from 'react'
import { formatearFecha } from '../data/fechas'
import ConfirmDialog from './ConfirmDialog'

function claseEstado(estado) {
  const texto = (estado || '').toLowerCase()

  if (texto === 'pendiente') {
    return 'bg-yellow-500/15 text-yellow-200'
  }

  if (texto === 'activa') {
    return 'bg-proton-blue/15 text-proton-blue'
  }

  if (texto === 'completada') {
    return 'bg-emerald-500/15 text-emerald-200'
  }

  if (texto === 'vencida') {
    return 'bg-red-500/15 text-red-200'
  }

  return 'bg-white/10 text-gray-300'
}

function TaskCard({
  tarea,
  nombreMateria,
  textoCompletar,
  onEdit,
  onDelete,
  onComplete,
  onOpenSubtasks
}) {
  const [pedirConfirmacion, setPedirConfirmacion] = useState(false)

  function handleDelete() {
    setPedirConfirmacion(true)
  }

  function confirmar() {
    setPedirConfirmacion(false)
    onDelete(tarea)
  }

  return (
    <article className="bg-panel border border-line rounded-xl p-6">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-white break-words">
            {tarea.titulo || 'Sin título'}
          </h3>

          <p className="text-gray-400 mt-1">
            {nombreMateria}
          </p>
        </div>

        <span className={'px-3 py-1 rounded-full text-sm font-medium ' + claseEstado(tarea.estado)}>
          {tarea.estado || 'Sin estado'}
        </span>
      </div>

      <p className="text-gray-300 mb-4 break-words">
        {tarea.descripcion || 'Sin descripción'}
      </p>

      <div className="space-y-2 text-gray-400">
        <p>
          <span className="font-medium text-gray-200">Peso: </span>
          {tarea.pesoTarea ?? '—'}
        </p>

        <p>
          <span className="font-medium text-gray-200">Entrega: </span>
          {formatearFecha(tarea.fechaEntrega)}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          onClick={onOpenSubtasks}
          className="border border-proton-blue text-proton-blue px-4 py-2 rounded-lg hover:bg-proton-blue/10 transition"
        >
          Ver subtareas
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="bg-proton text-white px-4 py-2 rounded-lg hover:bg-proton-dark transition"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={onComplete}
          className="border border-line text-gray-200 px-4 py-2 rounded-lg hover:bg-white/5 transition"
        >
          {textoCompletar}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Eliminar
        </button>
      </div>

      {pedirConfirmacion && (
        <ConfirmDialog
          titulo="Eliminar tarea"
          mensaje={'¿Eliminar "' + (tarea.titulo || 'esta tarea') + '"? También se borrarán sus subtareas. Esta acción no se puede deshacer.'}
          onConfirm={confirmar}
          onCancel={() => setPedirConfirmacion(false)}
        />
      )}
    </article>
  )
}

export default TaskCard
