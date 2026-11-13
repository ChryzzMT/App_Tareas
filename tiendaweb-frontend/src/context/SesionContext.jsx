import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const SesionContext = createContext(null);
const CLAVE_ID = 'usuarioId';
const CLAVE_NOMBRE = 'usuarioNombre';

export function SesionProvider({ children }) {
  // Patrón useState: la sesión arranca con lo último guardado en el navegador.
  const [usuario, setUsuario] = useState(() => ({
    id: localStorage.getItem(CLAVE_ID) || '',
    nombre: localStorage.getItem(CLAVE_NOMBRE) || '',
  }));

  // Patrón useEffect: sincroniza la sesión con localStorage, igual que el login de Angular.
  useEffect(() => {
    if (usuario.id) {
      localStorage.setItem(CLAVE_ID, usuario.id);
      localStorage.setItem(CLAVE_NOMBRE, usuario.nombre || '');
    } else {
      localStorage.removeItem(CLAVE_ID);
      localStorage.removeItem(CLAVE_NOMBRE);
    }
  }, [usuario]);

  const iniciar = useCallback((datos) => {
    setUsuario({
      id: String(datos.idUsuario),
      nombre: datos.nombre || '',
    });
  }, []);

  const cerrar = useCallback(() => {
    setUsuario({ id: '', nombre: '' });
  }, []);

  const valor = useMemo(() => ({
    usuarioId: usuario.id,
    nombre: usuario.nombre,
    iniciar,
    cerrar,
  }), [usuario, iniciar, cerrar]);

  return (
    <SesionContext.Provider value={valor}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de SesionProvider.');
  }
  return contexto;
}
