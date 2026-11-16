import { useState } from 'react'
import { apiEnviar, mensajeDeError } from '../data/api'
import Alert from './Alert'

function SubtaskForm({ user, tarea, onSaved, onCancel }) {
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const texto = descripcion.trim()

    if (texto === '') {
      setError('Escribe la descripción de la subtarea.')
      return
    }

    if (texto.length < 3 || texto.length > 150) {
      setError('La descripción debe tener entre 3 y 150 caracteres.')
      return
    }

    setError('')
    setGuardando(true)

    try {
      await apiEnviar('/GestionSubtarea/SetUser', 'PUT', user.idUsuario)
      await apiEnviar(
        '/GestionSubtarea/CreateSubtarea?tareaid='
          + tarea.idTarea
          + '&descripcion='
          + encodeURIComponent(texto),
        'POST',
        {}
      )
      onSaved('La subtarea se creó.')
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="bg-panel border border-line rounded-xl p-6 max-w-xl">
      <h2 className="text-xl font-bold text-white mb-2">
        Nueva subtarea
      </h2>

      <p className="text-gray-400 mb-5">
        Tarea: {tarea.titulo || 'Sin título'}
      </p>

      <Alert tipo="error" mensaje={error} />

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">
            Descripción (3 a 150 caracteres)
          </label>
          <input
            id="descripcion"
            name="descripcion"
            type="text"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            className="w-full px-4 py-3 border border-line rounded-lg bg-ink text-white focus:outline-none focus:ring-2 focus:ring-proton"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="bg-proton text-white px-5 py-3 rounded-lg hover:bg-proton-dark transition disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : 'Guardar subtarea'}
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

export default SubtaskForm
