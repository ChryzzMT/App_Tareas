import { useEffect, useState } from 'react'
import { apiEnviar, apiGet, comoLista, mensajeDeError } from '../data/api'
import { aFechaInput } from '../data/fechas'
import Alert from './Alert'

const FORMULARIO_VACIO = {
  idTarea: 0,
  titulo: '',
  descripcion: '',
  pesoTarea: '1',
  fechaEntrega: '',
  estado: 'Pendiente',
  idMateria: ''
}

const PESOS = [1, 2, 3, 5, 8, 13]

const inputClase = 'w-full px-4 py-3 border border-line rounded-lg bg-ink text-white focus:outline-none focus:ring-2 focus:ring-proton'

function datosDeTarea(tarea) {
  if (!tarea) {
    return FORMULARIO_VACIO
  }

  return {
    idTarea: tarea.idTarea,
    titulo: tarea.titulo || '',
    descripcion: tarea.descripcion || '',
    pesoTarea: String(tarea.pesoTarea || 1),
    fechaEntrega: aFechaInput(tarea.fechaEntrega),
    estado: tarea.estado || 'Pendiente',
    idMateria: tarea.idMateria ? String(tarea.idMateria) : ''
  }
}

function TaskForm({ user, editingTask, onSaved, onCancel, onGoMaterias }) {
  const clave = editingTask ? editingTask.idTarea : 0
  const [claveVista, setClaveVista] = useState(clave)
  const [form, setForm] = useState(() => datosDeTarea(editingTask))
  const [materias, setMaterias] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  // Si el padre manda otra tarea, el formulario se llena con esos datos.
  if (clave !== claveVista) {
    setClaveVista(clave)
    setForm(datosDeTarea(editingTask))
  }

  useEffect(() => {
    let activo = true

    async function cargarMaterias() {
      setCargando(true)

      try {
        await apiEnviar('/GestionMaterias/SetUsuario?userid=' + user.idUsuario, 'PUT', {})
        const lista = await apiGet('/GestionMaterias/lista-materias')

        if (!activo) {
          return
        }

        setMaterias(comoLista(lista))
      } catch (err) {
        if (activo) {
          setError(mensajeDeError(err))
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarMaterias()

    return () => {
      activo = false
    }
  }, [user.idUsuario])

  function changeForm(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const titulo = form.titulo.trim()
    const descripcion = form.descripcion.trim()

    if (titulo === '' || descripcion === '' || form.fechaEntrega === '' || form.idMateria === '') {
      setError('Completa el título, la descripción, la fecha y la materia.')
      return
    }

    if (titulo.length < 3 || titulo.length > 80) {
      setError('El título debe tener entre 3 y 80 caracteres.')
      return
    }

    if (descripcion.length < 3 || descripcion.length > 200) {
      setError('La descripción debe tener entre 3 y 200 caracteres.')
      return
    }

    if (!PESOS.includes(Number(form.pesoTarea))) {
      setError('Elige un peso de la lista: 1, 2, 3, 5, 8 o 13.')
      return
    }

    if (materias.length === 0) {
      setError('Crea una materia antes de guardar la tarea.')
      return
    }

    setError('')
    setGuardando(true)

    const cuerpo = {
      idTarea: form.idTarea,
      titulo: titulo,
      descripcion: descripcion,
      pesoTarea: Number(form.pesoTarea),
      fechaEntrega: form.fechaEntrega,
      estado: form.estado,
      idMateria: Number(form.idMateria),
      idUsuario: user.idUsuario
    }

    try {
      await apiEnviar('/GestionTareas/SETUSUARIO?usuario=' + user.idUsuario, 'POST', {})

      if (editingTask) {
        await apiEnviar('/GestionTareas/Actualizar-Todo', 'PUT', cuerpo)
        onSaved('La tarea se actualizó.')
      } else {
        await apiEnviar('/GestionTareas/Crear-Tarea', 'POST', cuerpo)
        onSaved('La tarea se guardó.')
      }
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="bg-panel border border-line rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-5">
        {editingTask ? 'Editar tarea' : 'Nueva tarea'}
      </h2>

      {cargando ? (
        <p className="text-proton-light mb-4">Cargando materias...</p>
      ) : null}

      <Alert tipo="error" mensaje={error} />

      {!cargando && materias.length === 0 && !error ? (
        <div className="mb-5">
          <Alert
            tipo="info"
            mensaje="Todavía no tienes materias. Crea una para poder asignar la tarea."
          />
          <button
            type="button"
            onClick={onGoMaterias}
            className="text-proton-blue hover:underline"
          >
            Ir a materias
          </button>
        </div>
      ) : null}

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-300 mb-2">
            Título (3 a 80 caracteres)
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={form.titulo}
            onChange={changeForm}
            className={inputClase}
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">
            Descripción (3 a 200 caracteres)
          </label>
          <input
            id="descripcion"
            name="descripcion"
            type="text"
            value={form.descripcion}
            onChange={changeForm}
            className={inputClase}
          />
        </div>

        <div>
          <label htmlFor="pesoTarea" className="block text-sm font-medium text-gray-300 mb-2">
            Peso (esfuerzo)
          </label>
          <select
            id="pesoTarea"
            name="pesoTarea"
            value={form.pesoTarea}
            onChange={changeForm}
            className={inputClase}
          >
            {PESOS.map((peso) => (
              <option key={peso} value={peso}>{peso}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Un número más alto significa más esfuerzo.
          </p>
        </div>

        <div>
          <label htmlFor="fechaEntrega" className="block text-sm font-medium text-gray-300 mb-2">
            Fecha de entrega
          </label>
          <input
            id="fechaEntrega"
            name="fechaEntrega"
            type="datetime-local"
            value={form.fechaEntrega}
            onChange={changeForm}
            className={inputClase}
          />
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-2">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={form.estado}
            onChange={changeForm}
            className={inputClase}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Activa">Activa</option>
            <option value="Completada">Completada</option>
            <option value="Vencida" disabled>Vencida</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Vencida la asigna el sistema cuando pasa la fecha.
          </p>
        </div>

        <div>
          <label htmlFor="idMateria" className="block text-sm font-medium text-gray-300 mb-2">
            Materia
          </label>
          <select
            id="idMateria"
            name="idMateria"
            value={form.idMateria}
            onChange={changeForm}
            className={inputClase}
          >
            <option value="">Elige una materia</option>
            {materias.map((materia) => (
              <option key={materia.idMateria} value={materia.idMateria}>
                {materia.nombreMateria}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={guardando || cargando}
            className="bg-proton text-white px-5 py-3 rounded-lg hover:bg-proton-dark transition disabled:opacity-60"
          >
            {guardando
              ? 'Guardando...'
              : editingTask
                ? 'Actualizar tarea'
                : 'Guardar tarea'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="border border-line text-gray-200 px-5 py-3 rounded-lg hover:bg-white/5 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  )
}

export default TaskForm
