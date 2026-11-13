import { EXPLICACION_REGLA } from '../logic/priorizacion';

export default function AyudaPrioridad() {
  return (
    <details className="ayuda-bloque">
      <summary>¿Cómo se decide qué va primero?</summary>
      <ul>
        {EXPLICACION_REGLA.map((linea) => <li key={linea}>{linea}</li>)}
      </ul>
    </details>
  );
}
