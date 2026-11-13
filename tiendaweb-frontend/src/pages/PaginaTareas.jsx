import { useCallback, useMemo, useRef, useState } from 'react';
import Marco from '../components/Marco';
import FormularioTarea from '../components/FormularioTarea';
import BarraFiltros from '../components/BarraFiltros';
import ResumenEstadisticas from '../components/ResumenEstadisticas';
import SeccionTareas from '../components/SeccionTareas';
import AyudaPrioridad from '../components/AyudaPrioridad';
import EstadoVacio from '../components/EstadoVacio';
import Cargando from '../components/Cargando';
import DialogoConfirmacion from '../components/DialogoConfirmacion';
import PanelSubtareas from '../components/PanelSubtareas';
import { useTareas } from '../hooks/useTareas';
import { useAtajos } from '../hooks/useAtajos';
import { resumir } from '../logic/priorizacion';
import { FILTROS_INICIALES, hayFiltroActivo, prepararLista, seccionesVisibles } from '../logic/vista';

export default function PaginaTareas() {
  const {
    pendientes,
    completadas,
    vencidas,
    revisar,
    materias,
    cargando,
    ocupado,
    error,
    recargar,
    crear,
    actualizar,
    eliminar,
    alternarCompletada,
  } = useTareas();

  // Patrón useState: filtros, edición y diálogos son estado de esta pantalla.
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [subtareaAbierta, setSubtareaAbierta] = useState(null);
  const formularioRef = useRef(null);
  const busquedaRef = useRef(null);

  const enfocarFormulario = useCallback(() => formularioRef.current?.enfocar(), []);
  const enfocarBusqueda = useCallback(() => busquedaRef.current?.focus(), []);
  const cerrarCapas = useCallback(() => {
    setConfirmacion(null);
    setSubtareaAbierta(null);
    if (tareaEnEdicion) setTareaEnEdicion(null);
  }, [tareaEnEdicion]);

  useAtajos({
    alBuscar: enfocarBusqueda,
    alCrear: enfocarFormulario,
    alCerrar: cerrarCapas,
  });

  const resumen = useMemo(
    () => resumir(pendientes, completadas, vencidas, materias),
    [pendientes, completadas, vencidas, materias],
  );

  const curso = prepararLista(pendientes, filtros, materias);
  const hechas = prepararLista(completadas, filtros, materias);
  const pasadas = prepararLista(vencidas, filtros, materias);
  const sueltas = prepararLista(revisar, filtros, materias);
  const visibles = seccionesVisibles(filtros);
  const sinNada = !pendientes.length && !completadas.length && !vencidas.length && !revisar.length;
  const filtrado = hayFiltroActivo(filtros);

  async function guardar(datos) {
    if (tareaEnEdicion) {
      await actualizar({ ...tareaEnEdicion, ...datos });
      setTareaEnEdicion(null);
    } else {
      await crear(datos);
    }
  }

  return (
    <Marco titulo="Tareas">
      <p className="intro">
        Las tareas en curso aparecen primero por fecha de entrega. La etiqueta de cada tarjeta dice
        si conviene hacerla ya, según la materia y el peso.
      </p>
      {error && (
        <div className="banner-error" role="alert">
          <p>{error}</p>
          <button type="button" className="boton boton-secundario" onClick={recargar}>Reintentar</button>
        </div>
      )}
      <ResumenEstadisticas resumen={resumen} filtros={filtros} onCambiar={setFiltros} />
      <AyudaPrioridad />
      <FormularioTarea
        ref={formularioRef}
        materias={materias}
        tareaEnEdicion={tareaEnEdicion}
        guardando={ocupado}
        onGuardar={guardar}
        onCancelar={() => setTareaEnEdicion(null)}
      />
      <BarraFiltros
        filtros={filtros}
        materias={materias}
        onCambiar={setFiltros}
        onLimpiar={() => setFiltros(FILTROS_INICIALES)}
        inputRef={busquedaRef}
      />
      {cargando && <Cargando texto="Cargando tus tareas…" />}
      {!cargando && sinNada && !filtrado && (
        <EstadoVacio
          titulo="Todavía no hay tareas"
          texto="Crea la primera con el formulario de arriba. Elige materia y peso para ver en qué cuadrante cae."
          accion={(
            <button type="button" className="boton boton-primario" onClick={enfocarFormulario}>
              Crear la primera tarea
            </button>
          )}
        />
      )}
      {!cargando && !(sinNada && !filtrado) && (
        <>
          {visibles.includes('curso') && (
            <SeccionTareas
              titulo="Tareas pendientes"
              tareas={curso}
              materias={materias}
              mensajeVacio={filtrado
                ? 'Ninguna tarea en curso coincide. Limpia los filtros para ver el resto.'
                : 'No hay tareas pendientes en este momento.'}
              onEditar={setTareaEnEdicion}
              onEliminar={setConfirmacion}
              onCompletar={alternarCompletada}
              onSubtareas={setSubtareaAbierta}
            />
          )}
          {visibles.includes('completadas') && (
            <SeccionTareas
              titulo="Tareas completadas"
              tareas={hechas}
              materias={materias}
              mensajeVacio={filtrado
                ? 'Ninguna tarea completada coincide con el filtro.'
                : 'No hay tareas terminadas en este momento.'}
              onEditar={setTareaEnEdicion}
              onEliminar={setConfirmacion}
              onCompletar={alternarCompletada}
              onSubtareas={setSubtareaAbierta}
            />
          )}
          {visibles.includes('vencidas') && (
            <SeccionTareas
              titulo="Tareas vencidas"
              tareas={pasadas}
              materias={materias}
              mensajeVacio={filtrado
                ? 'Ninguna tarea vencida coincide con el filtro.'
                : 'No hay tareas vencidas en este momento.'}
              onEditar={setTareaEnEdicion}
              onEliminar={setConfirmacion}
              onCompletar={alternarCompletada}
              onSubtareas={setSubtareaAbierta}
            />
          )}
          {visibles.includes('revisar') && sueltas.length > 0 && (
            <SeccionTareas
              titulo="Tareas por revisar"
              tareas={sueltas}
              materias={materias}
              mensajeVacio="No hay tareas fuera de las tres listas."
              onEditar={setTareaEnEdicion}
              onEliminar={setConfirmacion}
              onCompletar={alternarCompletada}
              onSubtareas={setSubtareaAbierta}
            />
          )}
        </>
      )}

      <DialogoConfirmacion
        abierto={Boolean(confirmacion)}
        titulo="Eliminar tarea"
        mensaje={confirmacion ? `¿Eliminar «${confirmacion.titulo}»?` : ''}
        detalle="También se borran sus subtareas. Después puedes deshacerlo durante unos segundos."
        textoConfirmar="Eliminar tarea"
        onCancelar={() => setConfirmacion(null)}
        onConfirmar={async () => {
          const titulo = confirmacion.titulo;
          setConfirmacion(null);
          await eliminar(titulo);
        }}
      />
      {subtareaAbierta && (
        <PanelSubtareas tarea={subtareaAbierta} onCerrar={() => setSubtareaAbierta(null)} />
      )}
    </Marco>
  );
}
