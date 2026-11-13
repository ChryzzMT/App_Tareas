import Cortina from './Cortina';

export default function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  detalle,
  textoConfirmar = 'Eliminar',
  onConfirmar,
  onCancelar,
}) {
  if (!abierto) return null;

  return (
    <Cortina tituloId="dialogo-titulo" titulo={titulo} onCerrar={onCancelar} etiquetaCerrar="Cerrar">
      <p>{mensaje}</p>
      {detalle && <p className="ayuda">{detalle}</p>}
      <div className="fila-botones">
        <button type="button" className="boton boton-peligro" onClick={onConfirmar}>
          {textoConfirmar}
        </button>
        <button type="button" className="boton boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </Cortina>
  );
}
