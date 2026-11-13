import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSesion } from '../hooks/useSesion';
import marca from '../assets/marca.svg';

const ENLACES = [
  { to: '/tareas', texto: 'Tareas' },
  { to: '/matriz', texto: 'Matriz' },
  { to: '/calendario', texto: 'Calendario' },
  { to: '/materias', texto: 'Materias' },
];

export default function Encabezado() {
  const { usuarioId, nombre, cerrar } = useSesion();
  const navegar = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function salir() {
    cerrar();
    setMenuAbierto(false);
    navegar('/login');
  }

  return (
    <header className="encabezado">
      <div className="encabezado-interno">
        <div className="marca">
          <img src={marca} alt="" width="42" height="42" />
          <div>
            <p className="nombre-sistema">Sistema de Priorización de Tareas</p>
            <p className="subtitulo">Impacto de la materia y esfuerzo de cada entrega</p>
          </div>
        </div>

        {usuarioId && (
          <button
            type="button"
            className="boton boton-menu"
            aria-expanded={menuAbierto}
            aria-controls="menu-principal"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            {menuAbierto ? 'Cerrar menú' : 'Menú'}
          </button>
        )}

        {usuarioId && (
          <nav
            id="menu-principal"
            className={`nav-principal ${menuAbierto ? 'abierta' : ''}`}
            aria-label="Secciones"
          >
            {ENLACES.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                className={({ isActive }) => `nav-link ${isActive ? 'activo' : ''}`}
                onClick={() => setMenuAbierto(false)}
              >
                {enlace.texto}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="sesion-encabezado">
          {usuarioId ? (
            <>
              <p>Hola, {nombre || 'estudiante'}</p>
              <button type="button" className="boton boton-texto boton-claro" onClick={salir}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link">Entrar</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
