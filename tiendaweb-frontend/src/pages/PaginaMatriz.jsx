import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marco from '../components/Marco';
import Cargando from '../components/Cargando';
import AyudaPrioridad from '../components/AyudaPrioridad';
import IndicadorPrioridad from '../components/IndicadorPrioridad';
import { useSesion } from '../hooks/useSesion';
import { useTareas } from '../hooks/useTareas';
import { CUADRANTES, ORDEN_MATRIZ, clasificarTarea, materiaDe } from '../logic/priorizacion';
import { formatearFecha } from '../logic/fechas';
import { obtenerMatriz } from '../services/matrizService';

export default function PaginaMatriz() {
  const { usuarioId } = useSesion();
  const { pendientes, materias } = useTareas();
  const [matriz, setMatriz] = useState(null);
  const [origen, setOrigen] = useState('servidor');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    obtenerMatriz(usuarioId)
      .then((datos) => {
        if (!vigente) return;
        setMatriz(datos);
        setOrigen('servidor');
        setError('');
      })
      .catch((fallo) => {
        if (!vigente) return;
        setError(fallo.message);
        const local = {
          oportunidades: [],
          ganancia_rapida: [],
          menor_ganancia: [],
          minima: [],
        };
        pendientes.forEach((tarea) => {
          const cuadrante = clasificarTarea(tarea, materiaDe(materias, tarea));
          if (cuadrante) local[cuadrante].push(tarea);
        });
        setMatriz(local);
        setOrigen('local');
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [usuarioId, pendientes, materias]);

  return (
    <Marco titulo="Matriz de prioridad">
      <p className="intro">
        Arriba está lo que más conviene atender. Cada grupo se distingue por su nombre, su forma y su borde.
      </p>
      <AyudaPrioridad />
      {cargando && <Cargando texto="Calculando la matriz…" />}
      {error && (
        <div className="banner-error" role="alert">
          <p>{error}</p>
          {origen === 'local' && (
            <p>Mientras tanto se muestra la misma regla aplicada a las tareas que ya estaban cargadas.</p>
          )}
        </div>
      )}
      {matriz && (
        <>
          <p className="eje-matriz" aria-hidden="true">Más impacto arriba · más esfuerzo a la derecha</p>
          <div className="matriz">
            {ORDEN_MATRIZ.map((id) => {
              const dato = CUADRANTES[id];
              const tareas = matriz[id] || [];
              return (
                <section key={id} className={`celda celda-${id}`} aria-labelledby={`cuadrante-${id}`}>
                  <header>
                    <IndicadorPrioridad cuadrante={id} />
                    <h2 id={`cuadrante-${id}`}>{dato.nombre}</h2>
                  </header>
                  <p>{dato.explicacion}</p>
                  {tareas.length === 0 ? (
                    <p className="vacio-linea">No hay tareas en este grupo.</p>
                  ) : (
                    <ul>
                      {tareas.map((tarea) => (
                        <li key={tarea.idTarea}>
                          <strong>{tarea.titulo}</strong>
                          <span>{formatearFecha(tarea.fechaEntrega)} · peso {tarea.pesoTarea}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
          <p className="ayuda">
            Para mover una tarea de grupo cambia su peso o la prioridad de la materia.{' '}
            <Link to="/tareas">Volver a las tareas</Link>
          </p>
        </>
      )}
    </Marco>
  );
}
