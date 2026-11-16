function ConfirmDialog({
  titulo,
  mensaje,
  textoConfirmar,
  onConfirm,
  onCancel
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmar"
        className="bg-panel border border-line rounded-xl p-6 max-w-md w-full shadow-xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h3 id="titulo-confirmar" className="text-xl font-bold text-white">
          {titulo}
        </h3>

        <p className="text-gray-300 mt-3">
          {mensaje}
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="border border-line text-gray-200 px-4 py-2 rounded-lg hover:bg-white/5 transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            {textoConfirmar || 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
