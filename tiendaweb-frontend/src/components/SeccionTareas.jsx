import TarjetaTarea from './TarjetaTarea';

export default function SeccionTareas({
  titulo,
  tareas,
  mensajeVacio,
  materias,
  onEditar,
  onEliminar,
  onCompletar,
  onSubtareas,
}) {
  const tituloId = `seccion-${titulo.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section className="seccion" aria-labelledby={tituloId}>
      <div className="seccion-cabecera">
        <h2 id={tituloId}>{titulo}</h2>
        <p>{tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'}</p>
      </div>
      {tareas.length === 0 ? (
        <p className="vacio-linea">{mensajeVacio}</p>
      ) : (
        <div className="rejilla-tareas">
          {tareas.map((tarea) => (
            <TarjetaTarea
              key={tarea.idTarea}
              tarea={tarea}
              materias={materias}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onCompletar={onCompletar}
              onSubtareas={onSubtareas}
            />
          ))}
        </div>
      )}
    </section>
  );
}
