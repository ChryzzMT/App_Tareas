import { useState } from 'react'
import { apiEnviar, mensajeDeError } from '../data/api'
import Alert from './Alert'

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
}

function RegisterForm({ onCreated, onGoLogin }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    contrasena: ''
  })

  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function changeForm(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nombre = form.nombre.trim()
    const email = form.email.trim()
    const contrasena = form.contrasena

    if (nombre === '' || email === '' || contrasena === '') {
      setError('Completa el nombre, el correo y la contraseña.')
      return
    }

    if (nombre.length < 2 || nombre.length > 40) {
      setError('El nombre debe tener entre 2 y 40 caracteres.')
      return
    }

    if (!correoValido(email)) {
      setError('Escribe un correo válido, por ejemplo ana@correo.com.')
      return
    }

    if (contrasena.length < 8 || contrasena.length > 18) {
      setError('La contraseña debe tener entre 8 y 18 caracteres.')
      return
    }

    setError('')
    setGuardando(true)

    try {
      const idCreado = await apiEnviar('/GestionUsuario/CrearUsuario', 'POST', {
        idUsuario: 0,
        nombre: nombre,
        email: email,
        contrasena: contrasena
      })

      if (!idCreado) {
        setError('No se pudo crear la cuenta. Inténtalo de nuevo.')
        return
      }

      onCreated()
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="bg-panel border border-line rounded-xl p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-2">
        Crear cuenta
      </h2>

      <p className="text-gray-400 mb-5">
        La contraseña debe tener entre 8 y 18 caracteres.
      </p>

      <Alert tipo="error" mensaje={error} />

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre
          </label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={changeForm}
            placeholder="Ana Pérez"
            className="w-full px-4 py-3 border border-line rounded-lg bg-ink text-white focus:outline-none focus:ring-2 focus:ring-proton"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Correo
          </label>

          <input
            id="email"
            name="email"
            type="text"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={changeForm}
            placeholder="ana@correo.com"
            className="w-full px-4 py-3 border border-line rounded-lg bg-ink text-white focus:outline-none focus:ring-2 focus:ring-proton"
          />
        </div>

        <div>
          <label htmlFor="contrasena" className="block text-sm font-medium text-gray-300 mb-2">
            Contraseña
          </label>

          <input
            id="contrasena"
            name="contrasena"
            type="password"
            autoComplete="new-password"
            value={form.contrasena}
            onChange={changeForm}
            className="w-full px-4 py-3 border border-line rounded-lg bg-ink text-white focus:outline-none focus:ring-2 focus:ring-proton"
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="bg-proton text-white px-5 py-3 rounded-lg hover:bg-proton-dark transition disabled:opacity-60"
        >
          {guardando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-gray-400 mt-5">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          onClick={onGoLogin}
          className="text-proton-blue hover:underline"
        >
          Inicia sesión
        </button>
      </p>
    </section>
  )
}

export default RegisterForm
