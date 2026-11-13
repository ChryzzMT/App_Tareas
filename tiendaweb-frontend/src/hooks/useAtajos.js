import { useEffect } from 'react';

function estaEscribiendo(objetivo) {
  const etiqueta = objetivo?.tagName;
  return etiqueta === 'INPUT' || etiqueta === 'TEXTAREA' || etiqueta === 'SELECT' || objetivo?.isContentEditable;
}

/** Atajos de la lista: / busca, n prepara una tarea, Escape cierra lo que esté abierto. */
export function useAtajos({ activo = true, alBuscar, alCrear, alCerrar }) {
  useEffect(() => {
    if (!activo) return undefined;

    function alTeclado(evento) {
      if (evento.key === 'Escape') {
        alCerrar?.();
        return;
      }
      if (estaEscribiendo(evento.target)) return;
      if (evento.key === '/') {
        evento.preventDefault();
        alBuscar?.();
      } else if (evento.key === 'n' || evento.key === 'N') {
        evento.preventDefault();
        alCrear?.();
      }
    }

    window.addEventListener('keydown', alTeclado);
    return () => window.removeEventListener('keydown', alTeclado);
  }, [activo, alBuscar, alCrear, alCerrar]);
}
