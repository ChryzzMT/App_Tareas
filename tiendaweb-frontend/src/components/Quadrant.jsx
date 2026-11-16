function Quadrant({ titulo, ayuda, tareas, clase }) {
  return (
    <section className={'rounded-xl border p-5 ' + clase}>
      <h2 className="text-lg font-bold text-white">
        {titulo}
      </h2>

      <p className="text-sm text-gray-400 mt-1 mb-4">
        {ayuda}
      </p>

      {tareas.length === 0 ? (
        <p className="text-gray-500">
          No hay tareas en este cuadrante.
        </p>
      ) : (
        <ul className="space-y-2">
          {tareas.map((tarea) => (
            <li
              key={tarea.idTarea}
              className="bg-ink/70 border border-line rounded-lg px-3 py-2 text-gray-100"
            >
              {tarea.titulo || 'Sin título'}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Quadrant
