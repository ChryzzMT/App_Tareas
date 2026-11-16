const ENLACES = [
  { id: 'tareas', texto: 'Tareas' },
  { id: 'materias', texto: 'Materias' },
  { id: 'calendario', texto: 'Calendario' },
  { id: 'matriz', texto: 'Matriz' }
]

function estaActivo(vista, id) {
  if (id === 'tareas') {
    return vista === 'tareas'
      || vista === 'tarea-form'
      || vista === 'subtareas'
      || vista === 'subtarea-form'
  }

  if (id === 'materias') {
    return vista === 'materias' || vista === 'materia-form'
  }

  return vista === id
}

function NavMenu({ vista, user, onNavigate, onLogout }) {
  return (
    <nav className="bg-ink border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2">

        {!user && (
          <>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className={vista === 'login'
                ? 'bg-proton text-white px-4 py-2 rounded-lg'
                : 'text-gray-300 px-4 py-2 rounded-lg hover:text-white'}
            >
              Ingresar
            </button>

            <button
              type="button"
              onClick={() => onNavigate('registro')}
              className={vista === 'registro'
                ? 'bg-proton text-white px-4 py-2 rounded-lg'
                : 'text-gray-300 px-4 py-2 rounded-lg hover:text-white'}
            >
              Crear cuenta
            </button>
          </>
        )}

        {user && ENLACES.map((enlace) => (
          <button
            key={enlace.id}
            type="button"
            aria-current={estaActivo(vista, enlace.id) ? 'page' : undefined}
            onClick={() => onNavigate(enlace.id)}
            className={estaActivo(vista, enlace.id)
              ? 'bg-proton text-white px-4 py-2 rounded-lg'
              : 'text-gray-300 px-4 py-2 rounded-lg hover:text-white hover:bg-white/5'}
          >
            {enlace.texto}
          </button>
        ))}

        {user && (
          <button
            type="button"
            onClick={onLogout}
            className="ml-auto border border-line text-gray-200 px-4 py-2 rounded-lg hover:bg-white/5 transition"
          >
            Cerrar sesión
          </button>
        )}

      </div>
    </nav>
  )
}

export default NavMenu
