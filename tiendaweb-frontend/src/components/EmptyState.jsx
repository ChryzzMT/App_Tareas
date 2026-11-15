function EmptyState({ titulo, texto }) {
  return (
    <div className="bg-panel border border-line rounded-xl p-8 text-center">
      <h3 className="text-lg font-semibold text-white">
        {titulo}
      </h3>

      <p className="text-gray-400 mt-2">
        {texto}
      </p>
    </div>
  )
}

export default EmptyState
