function Header({ user }) {
  return (
    <header className="bg-panel border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-proton text-white font-bold flex items-center justify-center">
          T
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">
            Priorizador de tareas
          </h1>

          <p className="text-gray-400 mt-1">
            {user
              ? 'Hola, ' + user.nombre + '. Organiza tus entregas académicas.'
              : 'Organiza materias, entregas y prioridades.'}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
