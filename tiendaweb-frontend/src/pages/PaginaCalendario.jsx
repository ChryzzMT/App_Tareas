import { useEffect, useState } from 'react';
import Marco from '../components/Marco';
import Cargando from '../components/Cargando';
import { useSesion } from '../hooks/useSesion';
import { CABECERA_SEMANA, MESES, desplazamientoPrimeraSemana, moverMes } from '../logic/calendarioVista';
import { obtenerMes } from '../services/calendarioService';

export default function PaginaCalendario() {
  const { usuarioId } = useSesion();
  const hoy = new Date();
  const [cursor, setCursor] = useState({ year: hoy.getFullYear(), mes: hoy.getMonth() + 1 });
  const [dias, setDias] = useState([]);
  const [vacios, setVacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    obtenerMes(usuarioId, cursor.year, cursor.mes)
      .then((mes) => {
        if (!vigente) return;
        const lista = mes?.listaDias || [];
        setDias(lista);
        setVacios(Array.from({ length: desplazamientoPrimeraSemana(lista) }, (_, indice) => indice));
        setError('');
      })
      .catch((fallo) => {
        if (!vigente) return;
        setError(fallo.message);
        setDias([]);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [usuarioId, cursor]);

  const esMesActual = cursor.mes === hoy.getMonth() + 1 && cursor.year === hoy.getFullYear();

  return (
    <Marco titulo="Calendario">
      <p className="intro">Las entregas se colocan en el día de su fecha. Hoy lleva la palabra Hoy, no solo un color.</p>
      <div className="calendario-controles">
        <button type="button" className="boton boton-secundario" onClick={() => setCursor((actual) => moverMes(actual.year, actual.mes, -1))}>
          Mes anterior
        </button>
        <h2>{MESES[cursor.mes - 1]} {cursor.year}</h2>
        <button type="button" className="boton boton-secundario" onClick={() => setCursor((actual) => moverMes(actual.year, actual.mes, 1))}>
          Mes siguiente
        </button>
      </div>
      {error && (
        <div className="banner-error" role="alert">
          <p>{error}</p>
        </div>
      )}
      {cargando && <Cargando texto="Cargando el mes…" />}
      <div className="calendario" role="grid" aria-label={`${MESES[cursor.mes - 1]} ${cursor.year}`}>
        {CABECERA_SEMANA.map((dia) => (
          <div key={dia} className="calendario-cabecera" role="columnheader">{dia}</div>
        ))}
        {vacios.map((indice) => <div key={`vacio-${indice}`} className="dia dia-vacio" role="gridcell" />)}
        {dias.map((dia) => {
          const esHoy = esMesActual && dia.dia === hoy.getDate();
          const tareas = dia.listaTareaDia || [];
          return (
            <div key={dia.dia} className={`dia ${esHoy ? 'dia-hoy' : ''} ${tareas.length ? 'dia-con-tareas' : ''}`} role="gridcell">
              <p className="dia-numero">
                <span>{dia.dia}</span>
                {esHoy && <span className="hoy-etiqueta">Hoy</span>}
              </p>
              <ul>
                {tareas.map((tarea) => (
                  <li key={tarea.idTarea}>{tarea.titulo}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Marco>
  );
}
