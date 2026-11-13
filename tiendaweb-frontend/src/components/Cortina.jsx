import { useEffect, useRef } from 'react';

export default function Cortina({ tituloId, titulo, onCerrar, children, etiquetaCerrar = 'Cerrar' }) {
  const dialogo = useRef(null);
  const cerrar = useRef(onCerrar);
  cerrar.current = onCerrar;

  useEffect(() => {
    const antes = document.activeElement;
    const nodo = dialogo.current;
    const enfocable = nodo?.querySelector('button, [href], input, select, textarea');
    enfocable?.focus();

    function alTeclado(evento) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        cerrar.current?.();
        return;
      }
      if (evento.key !== 'Tab' || !nodo) return;
      const nodos = [...nodo.querySelectorAll('button, [href], input, select, textarea')].filter((item) => !item.disabled);
      if (!nodos.length) return;
      const primero = nodos[0];
      const ultimo = nodos[nodos.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener('keydown', alTeclado);
    return () => {
      document.removeEventListener('keydown', alTeclado);
      if (antes instanceof HTMLElement) antes.focus();
    };
  }, []);

  return (
    <div className="cortina" onMouseDown={() => cerrar.current?.()}>
      <div
        className="dialogo"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        ref={dialogo}
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <div className="dialogo-cabecera">
          <h2 id={tituloId}>{titulo}</h2>
          <button type="button" className="boton boton-texto" onClick={() => cerrar.current?.()}>
            {etiquetaCerrar}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
