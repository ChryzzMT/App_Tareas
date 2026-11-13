import { useEffect, useState } from 'react';
import Cortina from './Cortina';
import { validarSubtarea } from '../logic/validacion';
import {
  actualizarDescripcionSubtarea,
  crearSubtarea,
  eliminarSubtarea,
  establecerUsuarioSubtareas,
  listarSubtareas,
} from '../services/subtareasService';
import { useSesion } from '../hooks/useSesion';

export default function PanelSubtareas({ tarea, onCerrar }) {
  const { usuarioId } = useSesion();
  const [subtareas, setSubtareas] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [textoEdicion, setTextoEdicion] = useState('');
  const [confirmarId, setConfirmarId] = useState(null);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      await establecerUsuarioSubtareas(usuarioId);
      const datos = await listarSubtareas(tarea.idTarea);
      setSubtareas(Array.isArray(datos) ? datos : []);
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setCargando(false);
    }
  }

  // Patrón useEffect: al abrir el panel se piden las subtareas de esta tarea.
  useEffect(() => {
    cargar();
  }, [tarea.idTarea, usuarioId]);

  async function agregar(evento) {
    evento.preventDefault();
    const mensaje = validarSubtarea(descripcion);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    setError('');
    try {
      await crearSubtarea(tarea.idTarea, descripcion.trim());
      setDescripcion('');
      setAviso('Subtarea guardada.');
      await cargar();
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  async function guardarEdicion(id) {
    const mensaje = validarSubtarea(textoEdicion);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    try {
      await actualizarDescripcionSubtarea(id, textoEdicion.trim());
      setEditando(null);
      setAviso('Texto actualizado.');
      await cargar();
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  async function borrar(id) {
    try {
      await eliminarSubtarea(id);
      setConfirmarId(null);
      setAviso('Subtarea eliminada.');
      await cargar();
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  return (
    <Cortina tituloId="titulo-subtareas" titulo={`Subtareas de ${tarea.titulo}`} onCerrar={onCerrar}>
      <p className="ayuda">Divide la entrega en pasos. Cerrar no borra lo que ya guardaste.</p>
      {error && <p className="error-campo" role="alert">{error}</p>}
      {aviso && <p className="aviso-linea" role="status">{aviso}</p>}
      <form className="formulario-subtarea" onSubmit={agregar}>
        <label htmlFor="nueva-subtarea">Nueva subtarea</label>
        <input
          id="nueva-subtarea"
          value={descripcion}
          onChange={(evento) => setDescripcion(evento.target.value)}
          placeholder="Por ejemplo: leer el capítulo 3"
        />
        <button type="submit" className="boton boton-primario">Agregar</button>
      </form>
      {cargando && <p role="status">Cargando subtareas…</p>}
      {!cargando && subtareas.length === 0 && <p className="vacio-linea">Esta tarea todavía no tiene subtareas.</p>}
      <ul className="lista-subtareas">
        {subtareas.map((subtarea) => (
          <li key={subtarea.idsubtarea}>
            {editando === subtarea.idsubtarea ? (
              <div className="fila-subtarea">
                <label className="sr-solo" htmlFor={`editar-${subtarea.idsubtarea}`}>Nuevo texto</label>
                <input
                  id={`editar-${subtarea.idsubtarea}`}
                  value={textoEdicion}
                  onChange={(evento) => setTextoEdicion(evento.target.value)}
                />
                <button type="button" className="boton boton-primario" onClick={() => guardarEdicion(subtarea.idsubtarea)}>
                  Guardar
                </button>
                <button type="button" className="boton boton-secundario" onClick={() => setEditando(null)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="fila-subtarea">
                <p>{subtarea.descripcion}</p>
                <button
                  type="button"
                  className="boton boton-secundario"
                  onClick={() => {
                    setEditando(subtarea.idsubtarea);
                    setTextoEdicion(subtarea.descripcion || '');
                  }}
                >
                  Corregir
                </button>
                <button type="button" className="boton boton-peligro-linea" onClick={() => setConfirmarId(subtarea.idsubtarea)}>
                  Eliminar
                </button>
              </div>
            )}
            {confirmarId === subtarea.idsubtarea && (
              <p className="confirmar-linea">
                ¿Eliminar esta subtarea?
                <button type="button" className="boton boton-peligro" onClick={() => borrar(subtarea.idsubtarea)}>Sí, eliminar</button>
                <button type="button" className="boton boton-secundario" onClick={() => setConfirmarId(null)}>No</button>
              </p>
            )}
          </li>
        ))}
      </ul>
    </Cortina>
  );
}
