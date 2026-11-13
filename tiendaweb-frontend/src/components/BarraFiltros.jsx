import { CUADRANTES, ORDEN_MATRIZ } from '../logic/priorizacion';

export default function BarraFiltros({ filtros, materias, onCambiar, onLimpiar, inputRef }) {
  function cambiar(evento) {
    const { name, value } = evento.target;
    // Patrón callback: los filtros viven en la página, no dentro de esta barra.
    onCambiar({ ...filtros, [name]: value });
  }

  return (
    <section className="panel panel-filtros" aria-label="Buscar y filtrar">
      <div className="rejilla-filtros">
        <div className="campo">
          <label htmlFor="buscar">Buscar</label>
          <input
            id="buscar"
            name="texto"
            ref={inputRef}
            value={filtros.texto}
            onChange={cambiar}
            placeholder="Título, descripción o materia"
            aria-describedby="ayuda-buscar"
          />
          <p className="ayuda" id="ayuda-buscar">Atajo: pulsa / para venir aquí. N prepara una tarea nueva.</p>
        </div>
        <div className="campo">
          <label htmlFor="mostrar">Mostrar</label>
          <select id="mostrar" name="mostrar" value={filtros.mostrar} onChange={cambiar}>
            <option value="todas">Todas las listas</option>
            <option value="curso">En curso</option>
            <option value="pendiente">Solo pendientes</option>
            <option value="activa">Solo activas</option>
            <option value="completadas">Completadas</option>
            <option value="vencidas">Vencidas</option>
            <option value="revisar">Por revisar</option>
          </select>
        </div>
        <div className="campo">
          <label htmlFor="filtro-materia">Filtrar por materia</label>
          <select id="filtro-materia" name="materia" value={filtros.materia} onChange={cambiar}>
            <option value="todas">Todas</option>
            {materias.map((materia) => (
              <option key={materia.idMateria} value={materia.idMateria}>{materia.nombreMateria}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="cuadrante">Prioridad</label>
          <select id="cuadrante" name="cuadrante" value={filtros.cuadrante} onChange={cambiar}>
            <option value="todos">Todas</option>
            {ORDEN_MATRIZ.map((id) => (
              <option key={id} value={id}>{CUADRANTES[id].nombre}</option>
            ))}
            <option value="sin_cuadrante">Fuera de la matriz</option>
          </select>
        </div>
        <div className="campo">
          <label htmlFor="orden">Orden</label>
          <select id="orden" name="orden" value={filtros.orden} onChange={cambiar}>
            <option value="servidor">Como las entrega el sistema</option>
            <option value="importancia">Por importancia del cuadrante</option>
            <option value="fecha">Entrega más próxima</option>
            <option value="fecha_lejana">Entrega más lejana</option>
            <option value="peso">Mayor peso primero</option>
          </select>
        </div>
      </div>
      <button type="button" className="boton boton-secundario" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </section>
  );
}
