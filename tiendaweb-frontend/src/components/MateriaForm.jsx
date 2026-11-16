import { useState } from 'react'
import { apiEnviar, mensajeDeError } from '../data/api'
import Alert from './Alert'

const PRIORIDADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const inputClase = 'w-full px-4 py-3 border border-line rounded-lg bg-ink text-white focus:outline-none focus:ring-2 focus:ring-proton'

function datosDeMateria(materia, idUsuario) {
  if (!materia) {
    return {
      idMateria: 0,
      nombreMateria: '',
      prioridadMateria: '5',
      idUsuario: idUsuario
    }
  }

  return {
    idMateria: materia.idMateria,
    nombreMateria: materia.nombreMateria || '',
    prioridadMateria: String(materia.prioridadMateria || 5),
    idUsuario: materia.idUsuario || idUsuario
  }
}

function MateriaForm({ user, editingMateria, onSaved, onCancel }) {
  const clave = editingMateria ? editingMateria.idMateria : 0
  const [claveVista, setClaveVista] = useState(clave)
  const [form, setForm] = useState(() => datosDeMateria(editingMateria, user.idUsuario))
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  if (clave !== claveVista) {
    setClaveVista(clave)
    setForm(datosDeMateria(editingMateria, user.idUsuario))
  }

  function changeForm(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nombre = form.nombreMateria.trim()
    const prioridad = Number(form.prioridadMateria)

    if (nombre === '') {
      setError('Escribe el nombre de la materia.')
      return
    }

    if (nombre.length < 2 || nombre.length > 60) {
      setError('El nombre debe tener entre 2 y 60 caracteres.')
      return
    }

    if (prioridad < 1 || prioridad > 10) {
      setError('La prioridad debe estar entre 1 y 10.')
      return
    }

    setError('')
    setGuardando(true)

    const cuerpo = {
      idMateria: form.idMateria,
      nombreMateria: nombre,
      prioridadMateria: prioridad,
      idUsuario: form.idUsuario || user.idUsuario
    }

    try {
      await apiEnviar('/GestionMaterias/SetUsuario?userid=' + user.idUsuario, 'PUT', {})

      if (editingMateria) {
        await apiEnviar('/GestionMaterias/actualizar', 'PUT', cuerpo)
        onSaved('La prioridad de la materia se actualizó.')
      } else {
        await apiEnviar('/GestionMaterias/agregar-materia', 'POST', cuerpo)
        onSaved('La materia se creó.')
      }
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="bg-panel border border-line rounded-xl p-6 max-w-xl">
      <h2 className="text-xl font-bold text-white mb-5">
        {editingMateria ? 'Editar materia' : 'Nueva materia'}
      </h2>

      <Alert tipo="error" mensaje={error} />

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombreMateria" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre (2 a 60 caracteres)
          </label>
          <input
            id="nombreMateria"
            name="nombreMateria"
            type="text"
            value={form.nombreMateria}
            onChange={changeForm}
            readOnly={Boolean(editingMateria)}
            className={inputClase + (editingMateria ? ' opacity-70' : '')}
          />
          {editingMateria ? (
            <p className="text-sm text-gray-500 mt-2">
              El servidor reconoce la materia por su nombre, así que aquí solo se cambia la prioridad.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="prioridadMateria" className="block text-sm font-medium text-gray-300 mb-2">
            Prioridad
          </label>
          <select
            id="prioridadMateria"
            name="prioridadMateria"
            value={form.prioridadMateria}
            onChange={changeForm}
            className={inputClase}
          >
            {PRIORIDADES.map((valor) => (
              <option key={valor} value={valor}>{valor}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            1 es la más baja y 10 la más alta.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="bg-proton text-white px-5 py-3 rounded-lg hover:bg-proton-dark transition disabled:opacity-60"
          >
            {guardando
              ? 'Guardando...'
              : editingMateria
                ? 'Actualizar'
                : 'Guardar'}
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

export default MateriaForm
