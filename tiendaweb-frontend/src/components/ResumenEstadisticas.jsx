import { formatearFecha } from '../logic/fechas';

export default function ResumenEstadisticas({ resumen, filtros, onCambiar }) {
  const tarjetas = [
    { id: 'curso', numero: resumen.curso, etiqueta: 'En curso', filtro: { mostrar: 'curso', cuadrante: 'todos' } },
    { id: 'completadas', numero: resumen.completadas, etiqueta: 'Completadas', filtro: { mostrar: 'completadas', cuadrante: 'todos' } },
    { id: 'vencidas', numero: resumen.vencidas, etiqueta: 'Vencidas', filtro: { mostrar: 'vencidas', cuadrante: 'todos' } },
    {
      id: 'oportunidades',
      numero: resumen.porCuadrante.oportunidades,
      etiqueta: 'Oportunidades',
      filtro: { mostrar: 'todas', cuadrante: 'oportunidades' },
    },
  ];

  return (
    <section className="resumen" aria-label="Resumen">
      {tarjetas.map((tarjeta) => {
        const pulsada = filtros.mostrar === tarjeta.filtro.mostrar && filtros.cuadrante === tarjeta.filtro.cuadrante;
        return (
          <button
            key={tarjeta.id}
            type="button"
            className={`resumen-item resumen-${tarjeta.id} ${pulsada ? 'pulsada' : ''}`}
            aria-pressed={pulsada}
            onClick={() => onCambiar({ ...filtros, ...tarjeta.filtro })}
          >
            <span className="resumen-numero">{tarjeta.numero}</span>
            <span>{tarjeta.etiqueta}</span>
          </button>
        );
      })}
      <p className="resumen-proxima">
        {resumen.proxima
          ? `Próxima entrega: ${resumen.proxima.titulo}, ${formatearFecha(resumen.proxima.fechaEntrega)}.`
          : 'No hay una entrega próxima en curso.'}
      </p>
    </section>
  );
}
