import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

function SubtaskCard({ subtarea, tituloTarea, onDelete }) {
  const [pedirConfirmacion, setPedirConfirmacion] = useState(false)

  function confirmar() {
    setPedirConfirmacion(false)
    onDelete(subtarea)
  }

  const titulo = subtarea.tarea && subtarea.tarea.titulo
    ? subtarea.tarea.titulo
    : tituloTarea

  return (
    <article className="bg-panel border border-line rounded-xl p-6">
      <h3 className="text-lg font-bold text-white break-words">
        {subtarea.descripcion}
      </h3>

      <p className="text-gray-400 mt-2">
        <span className="font-medium text-gray-200">Tarea: </span>
        {titulo || 'Sin tarea'}
      </p>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => setPedirConfirmacion(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Eliminar
        </button>
      </div>

      {pedirConfirmacion && (
        <ConfirmDialog
          titulo="Eliminar subtarea"
          mensaje={'¿Eliminar "' + subtarea.descripcion + '"?'}
          onConfirm={confirmar}
          onCancel={() => setPedirConfirmacion(false)}
        />
      )}
    </article>
  )
}

export default SubtaskCard
