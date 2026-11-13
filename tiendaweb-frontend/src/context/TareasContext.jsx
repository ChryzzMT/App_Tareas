import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSesion } from './SesionContext';
import { useAvisos } from './AvisosContext';
import { normalizarEstado } from '../logic/priorizacion';
import {
  actualizarTarea,
  crearTarea,
  eliminarTareaPorTitulo,
  establecerUsuarioTareas,
  listarCompletadas,
  listarParaRevision,
  listarPendientes,
  listarVencidas,
  marcarCompletada,
} from '../services/tareasService';
import {
  actualizarMateria,
  crearMateria,
  eliminarMateria,
  establecerUsuarioMaterias,
  listarMaterias,
} from '../services/materiasService';
import { crearSubtarea, establecerUsuarioSubtareas, listarSubtareas } from '../services/subtareasService';

const TareasContext = createContext(null);

function listasSeguras(valor) {
  return Array.isArray(valor) ? valor : [];
}

export function TareasProvider({ children }) {
  const { usuarioId } = useSesion();
  const { avisar } = useAvisos();

  // Patrón Context: una sola copia de tareas y materias para todas las páginas.
  const [pendientes, setPendientes] = useState([]);
  const [completadas, setCompletadas] = useState([]);
  const [vencidas, setVencidas] = useState([]);
  const [revisar, setRevisar] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    if (!usuarioId) {
      setPendientes([]);
      setCompletadas([]);
      setVencidas([]);
      setRevisar([]);
      setMaterias([]);
      return null;
    }

    setCargando(true);
    setError('');
    try {
      await establecerUsuarioTareas(usuarioId);
      await establecerUsuarioMaterias(usuarioId);
      // Primero las vencidas: ese endpoint actualiza el estado en el servidor.
      const vencidasServidor = listasSeguras(await listarVencidas());
      const [pendientesServidor, completadasServidor, materiasServidor, revisionServidor] = await Promise.all([
        listarPendientes(),
        listarCompletadas(),
        listarMaterias(),
        listarParaRevision().catch(() => []),
      ]);

      const siguientesPendientes = listasSeguras(pendientesServidor);
      const siguientesCompletadas = listasSeguras(completadasServidor);
      const siguientesMaterias = listasSeguras(materiasServidor);
      const ids = new Set(
        [...siguientesPendientes, ...siguientesCompletadas, ...vencidasServidor].map((tarea) => tarea.idTarea),
      );
      const huerfanas = listasSeguras(revisionServidor).filter((tarea) => !ids.has(tarea.idTarea));

      setPendientes(siguientesPendientes);
      setCompletadas(siguientesCompletadas);
      setVencidas(vencidasServidor);
      setMaterias(siguientesMaterias);
      setRevisar(huerfanas);
      return {
        pendientes: siguientesPendientes,
        completadas: siguientesCompletadas,
        vencidas: vencidasServidor,
        materias: siguientesMaterias,
      };
    } catch (fallo) {
      setError(fallo.message || 'No se pudieron cargar las tareas.');
      return null;
    } finally {
      setCargando(false);
    }
  }, [usuarioId]);

  // Patrón useEffect: al entrar (o cambiar de cuenta) se vuelven a pedir las tareas.
  useEffect(() => {
    let vigente = true;
    cargar().finally(() => {
      if (!vigente) return;
    });
    return () => {
      vigente = false;
    };
  }, [cargar]);

  const crear = useCallback(async (tarea) => {
    setOcupado(true);
    try {
      await crearTarea(tarea, usuarioId);
      await cargar();
      avisar({ tipo: 'exito', mensaje: `Se guardó «${tarea.titulo.trim()}».` });
    } catch (fallo) {
      avisar({ tipo: 'error', mensaje: fallo.message });
      throw fallo;
    } finally {
      setOcupado(false);
    }
  }, [avisar, cargar, usuarioId]);

  const actualizar = useCallback(async (tarea) => {
    setOcupado(true);
    try {
      await actualizarTarea(tarea, usuarioId);
      await cargar();
      avisar({ tipo: 'exito', mensaje: `Se actualizó «${tarea.titulo.trim()}».` });
    } catch (fallo) {
      avisar({ tipo: 'error', mensaje: fallo.message });
      throw fallo;
    } finally {
      setOcupado(false);
    }
  }, [avisar, cargar, usuarioId]);

  const eliminar = useCallback(async (titulo) => {
    const todas = [...pendientes, ...completadas, ...vencidas, ...revisar];
    const tarea = todas.find((item) => item.titulo === titulo);
    let subtareas = [];
    if (tarea) {
      try {
        await establecerUsuarioSubtareas(usuarioId);
        subtareas = listasSeguras(await listarSubtareas(tarea.idTarea));
      } catch {
        subtareas = [];
      }
    }

    setOcupado(true);
    try {
      await eliminarTareaPorTitulo(titulo);
      await cargar();
      avisar({
        tipo: 'exito',
        mensaje: `Se eliminó «${titulo}».`,
        deshacer: tarea
          ? async () => {
            await crearTarea({ ...tarea, idTarea: 0 }, usuarioId);
            const frescas = await cargar();
            const candidatas = [
              ...(frescas?.pendientes || []),
              ...(frescas?.completadas || []),
              ...(frescas?.vencidas || []),
            ].filter((item) => item.titulo === tarea.titulo && item.descripcion === tarea.descripcion);
            const nueva = candidatas.sort((a, b) => b.idTarea - a.idTarea)[0];
            if (nueva) {
              for (const subtarea of subtareas) {
                await crearSubtarea(nueva.idTarea, subtarea.descripcion);
              }
            }
            await cargar();
            avisar({ tipo: 'exito', mensaje: `Se restauró «${titulo}».` });
          }
          : undefined,
      });
    } catch (fallo) {
      avisar({ tipo: 'error', mensaje: fallo.message });
      throw fallo;
    } finally {
      setOcupado(false);
    }
  }, [avisar, cargar, completadas, pendientes, revisar, usuarioId, vencidas]);

  const alternarCompletada = useCallback(async (tarea) => {
    const cerrada = normalizarEstado(tarea.estado) === 'completada' || normalizarEstado(tarea.estado) === 'vencida';
    setOcupado(true);
    try {
      await marcarCompletada(tarea.idTarea);
      await cargar();
      avisar({
        tipo: 'exito',
        mensaje: cerrada
          ? `«${tarea.titulo}» volvió a pendiente. La entrega quedó para dentro de cinco días.`
          : `«${tarea.titulo}» quedó marcada como hecha.`,
      });
    } catch (fallo) {
      avisar({ tipo: 'error', mensaje: fallo.message });
    } finally {
      setOcupado(false);
    }
  }, [avisar, cargar]);

  const guardarMateria = useCallback(async (materia) => {
    setOcupado(true);
    try {
      if (materia.idMateria) {
        await actualizarMateria(materia, usuarioId);
        avisar({ tipo: 'exito', mensaje: `Se actualizó la prioridad de «${materia.nombreMateria.trim()}».` });
      } else {
        await crearMateria(materia, usuarioId);
        avisar({ tipo: 'exito', mensaje: `Se creó la materia «${materia.nombreMateria.trim()}».` });
      }
      await cargar();
    } catch (fallo) {
      avisar({ tipo: 'error', mensaje: fallo.message });
      throw fallo;
    } finally {
      setOcupado(false);
    }
  }, [avisar, cargar, usuarioId]);

  const quitarMateria = useCallback(async (nombre) => {
    setOcupado(true);
    try {
      await eliminarMateria(nombre);
      await cargar();
      avisar({ tipo: 'exito', mensaje: `Se eliminó la materia «${nombre}» y sus tareas.` });
    } catch (fallo) {
      avisar({ tipo: 'error', mensaje: fallo.message });
      throw fallo;
    } finally {
      setOcupado(false);
    }
  }, [avisar, cargar]);

  const valor = useMemo(() => ({
    pendientes,
    completadas,
    vencidas,
    revisar,
    materias,
    cargando,
    ocupado,
    error,
    recargar: cargar,
    crear,
    actualizar,
    eliminar,
    alternarCompletada,
    guardarMateria,
    quitarMateria,
  }), [
    pendientes,
    completadas,
    vencidas,
    revisar,
    materias,
    cargando,
    ocupado,
    error,
    cargar,
    crear,
    actualizar,
    eliminar,
    alternarCompletada,
    guardarMateria,
    quitarMateria,
  ]);

  return (
    <TareasContext.Provider value={valor}>
      {children}
    </TareasContext.Provider>
  );
}

export function useTareas() {
  const contexto = useContext(TareasContext);
  if (!contexto) {
    throw new Error('useTareas debe usarse dentro de TareasProvider.');
  }
  return contexto;
}
