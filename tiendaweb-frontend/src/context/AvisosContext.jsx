import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AvisosContext = createContext(null);

export function AvisosProvider({ children }) {
  // Patrón useState: la cola de avisos vive en un solo lugar.
  const [avisos, setAvisos] = useState([]);
  const tiempos = useRef(new Set());

  useEffect(() => () => {
    tiempos.current.forEach((tiempo) => window.clearTimeout(tiempo));
  }, []);

  const cerrar = useCallback((id) => {
    setAvisos((previos) => previos.filter((aviso) => aviso.id !== id));
  }, []);

  const avisar = useCallback((aviso) => {
    const id = globalThis.crypto?.randomUUID?.() || `aviso-${Date.now()}`;
    setAvisos((previos) => [...previos, { id, tipo: 'exito', ...aviso }].slice(-3));
    const tiempo = window.setTimeout(() => {
      tiempos.current.delete(tiempo);
      setAvisos((previos) => previos.filter((item) => item.id !== id));
    }, aviso.deshacer ? 10000 : 5000);
    tiempos.current.add(tiempo);
    return id;
  }, []);

  const valor = useMemo(() => ({ avisos, avisar, cerrar }), [avisos, avisar, cerrar]);

  return (
    <AvisosContext.Provider value={valor}>
      {children}
    </AvisosContext.Provider>
  );
}

export function useAvisos() {
  const contexto = useContext(AvisosContext);
  if (!contexto) {
    throw new Error('useAvisos debe usarse dentro de AvisosProvider.');
  }
  return contexto;
}
