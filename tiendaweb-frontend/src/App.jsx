import { useState } from 'react'

import Header from './components/Header'
import Footer from './components/Footer'
import NavMenu from './components/NavMenu'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import MateriaList from './components/MateriaList'
import MateriaForm from './components/MateriaForm'
import SubtaskList from './components/SubtaskList'
import SubtaskForm from './components/SubtaskForm'
import CalendarView from './components/CalendarView'
import MatrixView from './components/MatrixView'

// La sesión vive en localStorage, igual que en la app anterior.
function leerSesion() {
  const id = localStorage.getItem('usuarioId')
  const nombre = localStorage.getItem('usuarioNombre')

  if (!id) {
    return null
  }

  return {
    idUsuario: Number(id),
    nombre: nombre || ''
  }
}

function App() {
  const sesionInicial = leerSesion()

  // La vista reemplaza al router: un estado dice qué pantalla se muestra.
  const [vista, setVista] = useState(sesionInicial ? 'tareas' : 'login')
  const [user, setUser] = useState(sesionInicial)
  const [aviso, setAviso] = useState('')
  const [tareaActual, setTareaActual] = useState(null)
  const [materiaActual, setMateriaActual] = useState(null)

  function irA(destino) {
    setAviso('')
    setVista(destino)
  }

  function ingresar(usuario) {
    localStorage.setItem('usuarioId', String(usuario.idUsuario))
    localStorage.setItem('usuarioNombre', usuario.nombre)
    setUser(usuario)
    setAviso('')
    setVista('tareas')
  }

  function cerrarSesion() {
    localStorage.removeItem('usuarioId')
    localStorage.removeItem('usuarioNombre')
    setUser(null)
    setTareaActual(null)
    setMateriaActual(null)
    setAviso('')
    setVista('login')
  }

  function cuentaCreada() {
    setAviso('Tu cuenta fue creada. Ahora inicia sesión con esos datos.')
    setVista('login')
  }

  function nuevaTarea() {
    setTareaActual(null)
    setAviso('')
    setVista('tarea-form')
  }

  function editarTarea(tarea) {
    setTareaActual(tarea)
    setAviso('')
    setVista('tarea-form')
  }

  function tareaGuardada(mensaje) {
    setTareaActual(null)
    setAviso(mensaje)
    setVista('tareas')
  }

  function verSubtareas(tarea) {
    setTareaActual(tarea)
    setAviso('')
    setVista('subtareas')
  }

  function subtareaGuardada(mensaje) {
    setAviso(mensaje)
    setVista('subtareas')
  }

  function nuevaMateria() {
    setMateriaActual(null)
    setAviso('')
    setVista('materia-form')
  }

  function editarMateria(materia) {
    setMateriaActual(materia)
    setAviso('')
    setVista('materia-form')
  }

  function materiaGuardada(mensaje) {
    setMateriaActual(null)
    setAviso(mensaje)
    setVista('materias')
  }

  let pantalla

  if (!user && vista !== 'registro') {
    pantalla = (
      <LoginForm
        aviso={aviso}
        onLogin={ingresar}
        onGoRegister={() => irA('registro')}
      />
    )
  } else if (vista === 'registro') {
    pantalla = (
      <RegisterForm
        onCreated={cuentaCreada}
        onGoLogin={() => irA('login')}
      />
    )
  } else if (vista === 'tarea-form') {
    pantalla = (
      <TaskForm
        user={user}
        editingTask={tareaActual}
        onSaved={tareaGuardada}
        onCancel={() => irA('tareas')}
        onGoMaterias={() => irA('materias')}
      />
    )
  } else if (vista === 'subtareas' && tareaActual) {
    pantalla = (
      <SubtaskList
        user={user}
        tarea={tareaActual}
        aviso={aviso}
        onCreate={() => irA('subtarea-form')}
        onBack={() => irA('tareas')}
      />
    )
  } else if (vista === 'subtarea-form' && tareaActual) {
    pantalla = (
      <SubtaskForm
        user={user}
        tarea={tareaActual}
        onSaved={subtareaGuardada}
        onCancel={() => irA('subtareas')}
      />
    )
  } else if (vista === 'materias') {
    pantalla = (
      <MateriaList
        user={user}
        aviso={aviso}
        onCreate={nuevaMateria}
        onEdit={editarMateria}
      />
    )
  } else if (vista === 'materia-form') {
    pantalla = (
      <MateriaForm
        user={user}
        editingMateria={materiaActual}
        onSaved={materiaGuardada}
        onCancel={() => irA('materias')}
      />
    )
  } else if (vista === 'calendario') {
    pantalla = <CalendarView user={user} />
  } else if (vista === 'matriz') {
    pantalla = <MatrixView user={user} />
  } else {
    pantalla = (
      <TaskList
        user={user}
        aviso={aviso}
        onCreate={nuevaTarea}
        onEdit={editarTarea}
        onOpenSubtasks={verSubtareas}
      />
    )
  }

  return (
    <div className="min-h-screen bg-ink text-gray-100 flex flex-col">
      <Header user={user} />

      <NavMenu
        vista={vista}
        user={user}
        onNavigate={irA}
        onLogout={cerrarSesion}
      />

      <main className="max-w-5xl mx-auto px-6 py-8 w-full flex-1">
        {pantalla}
      </main>

      <Footer />
    </div>
  )
}

export default App
