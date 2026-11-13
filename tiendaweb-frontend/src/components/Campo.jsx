export default function Campo({ id, etiqueta, ayuda, error, children }) {
  return (
    <div className={`campo ${error ? 'campo-invalido' : ''}`}>
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {ayuda && <p className="ayuda" id={`${id}-ayuda`}>{ayuda}</p>}
      {error && <p className="error-campo" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

export function descritoPor(id, ayuda, error) {
  return [ayuda ? `${id}-ayuda` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
}
