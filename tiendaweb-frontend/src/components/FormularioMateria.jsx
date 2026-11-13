import { useEffect, useState } from 'react';
import Campo, { descritoPor } from './Campo';
import { tieneErrores, validarMateria } from '../logic/validacion';

const VACIA = { idMateria: 0, nombreMateria: '', prioridadMateria: '', idUsuario: 0 };

export default function FormularioMateria({ materiaEnEdicion, guardando, onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState(VACIA);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (!materiaEnEdicion) {
      setFormulario(VACIA);
      setErrores({});
      return;
    }
    setFormulario({
      idMateria: materiaEnEdicion.idMateria,
      nombreMateria: materiaEnEdicion.nombreMateria || '',
      prioridadMateria: String(materiaEnEdicion.prioridadMateria ?? ''),
      idUsuario: materiaEnEdicion.idUsuario || 0,
    });
    setErrores({});
  }, [materiaEnEdicion]);

  async function enviar(evento) {
    evento.preventDefault();
    const hallados = validarMateria(formulario);
    setErrores(hallados);
    if (tieneErrores(hallados)) return;
    try {
      await onGuardar(formulario);
      if (!materiaEnEdicion) setFormulario(VACIA);
    } catch {
      // El contexto muestra el error.
    }
  }

  const editando = Boolean(materiaEnEdicion);

  return (
    <section className="panel">
      <h2>{editando ? 'Cambiar prioridad' : 'Nueva materia'}</h2>
      <form className="rejilla-formulario" onSubmit={enviar} noValidate>
        <Campo
          id="nombreMateria"
          etiqueta="Nombre"
          ayuda={editando
            ? 'El servidor reconoce la materia por su nombre y solo guarda la prioridad. El nombre no cambia aquí.'
            : 'Como aparece en tus apuntes o en el horario.'}
          error={errores.nombreMateria}
        >
          <input
            id="nombreMateria"
            name="nombreMateria"
            value={formulario.nombreMateria}
            onChange={(evento) => setFormulario((previo) => ({ ...previo, nombreMateria: evento.target.value }))}
            readOnly={editando}
            aria-invalid={Boolean(errores.nombreMateria)}
            aria-describedby={descritoPor('nombreMateria', true, errores.nombreMateria)}
          />
        </Campo>
        <Campo
          id="prioridadMateria"
          etiqueta="Prioridad de la materia"
          ayuda="1 es poco importante y 10 es imprescindible. Desde 8 cuenta como alto impacto."
          error={errores.prioridadMateria}
        >
          <select
            id="prioridadMateria"
            name="prioridadMateria"
            value={formulario.prioridadMateria}
            onChange={(evento) => setFormulario((previo) => ({ ...previo, prioridadMateria: evento.target.value }))}
            aria-invalid={Boolean(errores.prioridadMateria)}
            aria-describedby={descritoPor('prioridadMateria', true, errores.prioridadMateria)}
          >
            <option value="">Elegir</option>
            {Array.from({ length: 10 }, (_, indice) => indice + 1).map((valor) => (
              <option key={valor} value={valor}>{valor}</option>
            ))}
          </select>
        </Campo>
        <div className="fila-botones fila-ancha">
          <button type="submit" className="boton boton-primario" disabled={guardando}>
            {guardando ? 'Guardando…' : editando ? 'Actualizar prioridad' : 'Guardar materia'}
          </button>
          {editando && (
            <button type="button" className="boton boton-secundario" onClick={onCancelar}>Cancelar</button>
          )}
        </div>
      </form>
    </section>
  );
}
