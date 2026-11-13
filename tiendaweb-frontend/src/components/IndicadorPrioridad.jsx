import { CUADRANTES } from '../logic/priorizacion';

/** La prioridad se lee por texto, forma y color. El color no es el único indicio. */
export default function IndicadorPrioridad({ cuadrante }) {
  if (!cuadrante || !CUADRANTES[cuadrante]) {
    return (
      <span className="prioridad prioridad-fuera">
        <span className="prioridad-forma forma-raya" aria-hidden="true" />
        <span>Fuera de la matriz</span>
      </span>
    );
  }

  const dato = CUADRANTES[cuadrante];
  return (
    <span className={`prioridad prioridad-${cuadrante}`} title={dato.explicacion}>
      <span className={`prioridad-forma forma-${dato.forma}`} aria-hidden="true" />
      <span>{dato.nombre}</span>
    </span>
  );
}
