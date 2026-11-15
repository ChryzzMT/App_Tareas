function Alert({ tipo, mensaje }) {
  if (!mensaje) {
    return null
  }

  let clase = 'bg-proton-blue/10 border-proton-blue/40 text-sky-100'

  if (tipo === 'error') {
    clase = 'bg-red-500/10 border-red-400/50 text-red-200'
  }

  if (tipo === 'exito') {
    clase = 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200'
  }

  return (
    <div
      role="alert"
      className={'mb-5 border px-4 py-3 rounded-lg ' + clase}
    >
      {mensaje}
    </div>
  )
}

export default Alert
