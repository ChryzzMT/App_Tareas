import { Navigate, useLocation } from 'react-router-dom';
import { useSesion } from '../hooks/useSesion';

export default function RutaPrivada({ children }) {
  const { usuarioId } = useSesion();
  const ubicacion = useLocation();
  if (!usuarioId) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ aviso: 'Entra con tu cuenta para ver tus tareas.', desde: ubicacion.pathname }}
      />
    );
  }
  return children;
}
