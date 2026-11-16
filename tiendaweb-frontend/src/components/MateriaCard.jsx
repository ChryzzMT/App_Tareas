import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

function MateriaCard({ materia, onEdit, onDelete }) {
  const [pedirConfirmacion, setPedirConfirmacion] = useState(false)

  function confirmar() {
    setPedirConfirmacion(false)
    onDelete(materia)
  }

  return (
    <article className="bg-panel border border-line rounded-xl p-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-bold text-white break-words">
            {materia.nombreMateria}
          </h3>

          <p className="text-gray-400 mt-2">
            <span className="font-medium text-gray-200">Prioridad: </span>
            {materia.prioridadMateria}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-sm font-medium bg-proton/20 text-proton-light">
          {materia.prioridadMateria} / 10
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          onClick={onEdit}
          className="bg-proton text-white px-4 py-2 rounded-lg hover:bg-proton-dark transition"
        >
          Editar
        </button>

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
          titulo="Eliminar materia"
          mensaje={'¿Eliminar "' + materia.nombreMateria + '"? También se borrarán las tareas de esa materia.'}
          onConfirm={confirmar}
          onCancel={() => setPedirConfirmacion(false)}
        />
      )}
    </article>
  )
}

export default MateriaCard
