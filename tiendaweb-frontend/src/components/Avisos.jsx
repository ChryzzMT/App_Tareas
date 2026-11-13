import { useAvisos } from '../context/AvisosContext';

export default function Avisos() {
  const { avisos, cerrar, avisar } = useAvisos();
  if (!avisos.length) return null;

  return (
    <div className="avisos" aria-live="polite" aria-relevant="additions">
      {avisos.map((aviso) => (
        <div key={aviso.id} className={`aviso aviso-${aviso.tipo}`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
          <p>{aviso.mensaje}</p>
          <div className="aviso-acciones">
            {aviso.deshacer && (
              <button
                type="button"
                onClick={async () => {
                  cerrar(aviso.id);
                  try {
                    await aviso.deshacer();
                  } catch (fallo) {
                    avisar({ tipo: 'error', mensaje: fallo.message || 'No se pudo deshacer. Crea la tarea de nuevo desde el formulario.' });
                  }
                }}
              >
                Deshacer
              </button>
            )}
            <button type="button" onClick={() => cerrar(aviso.id)}>
              Cerrar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
