export default function EstadoVacio({ titulo, texto, accion }) {
  return (
    <div className="vacio">
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {accion}
    </div>
  );
}
