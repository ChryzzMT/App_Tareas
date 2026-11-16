import { useState } from 'react'
import { apiEnviar, apiGet, mensajeDeError } from '../data/api'
import Alert from './Alert'

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
}

function LoginForm({ aviso, onLogin, onGoRegister }) {
  const [form, setForm] = useState({
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

    const email = form.email.trim()
    const contrasena = form.contrasena

    if (email === '' || contrasena === '') {
      setError('Completa el correo y la contraseña.')
      return
    }

    if (!correoValido(email)) {
      setError('Escribe un correo válido, por ejemplo ana@correo.com.')
      return
    }

    setError('')
    setGuardando(true)

    try {
      const ruta = '/GestionUsuario/VerificarUsuario?m='
        + encodeURIComponent(email)
        + '&c='
        + encodeURIComponent(contrasena)

      const usuario = await apiGet(ruta)

      if (!usuario || !usuario.idUsuario) {
        setError('El correo o la contraseña son incorrectos.')
        return
      }

      // El backend guarda el usuario activo en memoria. Hay que avisarle antes de listar.
      await apiEnviar('/GestionMaterias/SetUsuario?userid=' + usuario.idUsuario, 'PUT', {})
      await apiEnviar('/GestionTareas/SETUSUARIO?usuario=' + usuario.idUsuario, 'POST', {})

      onLogin({
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre
      })
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="bg-panel border border-line rounded-xl p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-2">
        Iniciar sesión
      </h2>

      <p className="text-gray-400 mb-5">
        Usa el correo y la contraseña de tu cuenta.
      </p>

      <Alert tipo="exito" mensaje={aviso} />
      <Alert tipo="error" mensaje={error} />

      <form className="grid gap-4" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
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
          {guardando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="text-gray-400 mt-5">
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          onClick={onGoRegister}
          className="text-proton-blue hover:underline"
        >
          Regístrate aquí
        </button>
      </p>
    </section>
  )
}

export default LoginForm
