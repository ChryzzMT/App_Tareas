import IndicadorEstado from './IndicadorEstado';
import IndicadorPrioridad from './IndicadorPrioridad';
import { clasificarTarea, materiaDe, normalizarEstado } from '../logic/priorizacion';
import { formatearFecha } from '../logic/fechas';

export default function TarjetaTarea({
  tarea,
  materias,
  onEditar,
  onEliminar,
  onCompletar,
  onSubtareas,
}) {
  const materia = materiaDe(materias, tarea);
  const cuadrante = clasificarTarea(tarea, materia);
  const cerrada = normalizarEstado(tarea.estado) === 'completada' || normalizarEstado(tarea.estado) === 'vencida';
  const tituloId = `tarea-${tarea.idTarea}`;

  return (
    <article className={`tarjeta tarjeta-${cuadrante || 'fuera'}`} aria-labelledby={tituloId}>
      <header className="tarjeta-cabecera">
        <h3 id={tituloId}>{tarea.titulo}</h3>
        <IndicadorEstado estado={tarea.estado} />
      </header>
      <p className="tarjeta-descripcion">{tarea.descripcion}</p>
      <dl className="ficha">
        <div>
          <dt>Materia</dt>
          <dd>
            {materia?.nombreMateria || 'Sin materia'}
            {materia?.prioridadMateria != null && ` · prioridad ${materia.prioridadMateria}`}
          </dd>
        </div>
        <div>
          <dt>Peso</dt>
          <dd>{tarea.pesoTarea}</dd>
        </div>
        <div>
          <dt>Entrega</dt>
          <dd>
            <time dateTime={tarea.fechaEntrega || undefined}>{formatearFecha(tarea.fechaEntrega)}</time>
          </dd>
        </div>
      </dl>
      <IndicadorPrioridad cuadrante={cuadrante} />
      <div className="fila-botones">
        {/* Patrón callback: la tarjeta no guarda nada; pide la acción al padre. */}
        <button type="button" className="boton boton-secundario" onClick={() => onEditar(tarea)}>
          Editar
        </button>
        <button type="button" className="boton boton-secundario" onClick={() => onSubtareas(tarea)}>
          Subtareas
        </button>
        <button type="button" className="boton boton-secundario" onClick={() => onCompletar(tarea)}>
          {cerrada ? 'Volver a pendiente' : 'Marcar como hecha'}
        </button>
        <button type="button" className="boton boton-peligro-linea" onClick={() => onEliminar(tarea)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}
