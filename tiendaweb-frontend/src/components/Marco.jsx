import Encabezado from './Encabezado';
import Pie from './Pie';

export default function Marco({ titulo, children }) {
  return (
    <div className="app">
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <Encabezado />
      <main id="contenido" className="contenido" tabIndex={-1}>
        <h1>{titulo}</h1>
        {children}
      </main>
      <Pie />
    </div>
  );
}
