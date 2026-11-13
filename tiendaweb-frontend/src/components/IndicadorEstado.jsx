import { ESTADOS, normalizarEstado, nombreEstado } from '../logic/priorizacion';

export default function IndicadorEstado({ estado }) {
  const id = normalizarEstado(estado);
  const dato = ESTADOS[id];
  return (
    <span className={`estado estado-${dato ? id : 'otro'}`}>
      <span className="estado-simbolo" aria-hidden="true">{dato?.simbolo || '•'}</span>
      <span>{nombreEstado(estado)}</span>
    </span>
  );
}
