import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Campo, { descritoPor } from './Campo';
import { PESOS } from '../logic/priorizacion';
import { avisoFecha, tieneErrores, validarTarea } from '../logic/validacion';
import { aFechaLocal } from '../logic/fechas';

const VACIO = {
  idTarea: 0,
  titulo: '',
  descripcion: '',
  pesoTarea: '',
  fechaEntrega: '',
  estado: 'Pendiente',
  idMateria: '',
};

const FormularioTarea = forwardRef(function FormularioTarea({
  materias,
  tareaEnEdicion,
  guardando,
  onGuardar,
  onCancelar,
}, ref) {
  // Patrón useState: el formulario es controlado. El padre no duplica estos campos.
  const [formulario, setFormulario] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const tituloRef = useRef(null);

  useImperativeHandle(ref, () => ({
    enfocar() {
      tituloRef.current?.focus();
      tituloRef.current?.scrollIntoView({ block: 'center' });
    },
  }));

  // Patrón useEffect: al elegir Editar, el formulario copia la tarea que manda el padre.
  useEffect(() => {
    if (!tareaEnEdicion) {
      setFormulario(VACIO);
      setErrores({});
      return;
    }
    setFormulario({
      idTarea: tareaEnEdicion.idTarea,
      titulo: tareaEnEdicion.titulo || '',
      descripcion: tareaEnEdicion.descripcion || '',
      pesoTarea: tareaEnEdicion.pesoTarea ?? '',
      fechaEntrega: aFechaLocal(tareaEnEdicion.fechaEntrega),
      estado: tareaEnEdicion.estado || 'Pendiente',
      idMateria: tareaEnEdicion.idMateria ? String(tareaEnEdicion.idMateria) : '',
    });
    setErrores({});
    tituloRef.current?.focus();
  }, [tareaEnEdicion]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario((previo) => ({ ...previo, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const hallados = validarTarea(formulario);
    setErrores(hallados);
    if (tieneErrores(hallados)) return;
    try {
      // Patrón callback: el hijo avisa; el padre crea o actualiza en el contexto.
      await onGuardar(formulario);
      if (!tareaEnEdicion) {
        setFormulario(VACIO);
        setErrores({});
      }
    } catch {
      // El aviso de error lo muestra el contexto.
    }
  }

  const aviso = avisoFecha(formulario);
  const editando = Boolean(tareaEnEdicion);

  return (
    <section className="panel" aria-labelledby="titulo-formulario">
      <h2 id="titulo-formulario">{editando ? 'Editar tarea' : 'Nueva tarea'}</h2>
      {!materias.length && (
        <p className="aviso-linea" role="status">
          Primero crea una materia. Su prioridad es la que decide el cuadrante.{' '}
          <Link to="/materias">Ir a materias</Link>
        </p>
      )}
      <form className="rejilla-formulario" onSubmit={enviar} noValidate>
        <Campo
          id="titulo"
          etiqueta="Título"
          ayuda="Un nombre corto, sin la barra /."
          error={errores.titulo}
        >
          <input
            id="titulo"
            name="titulo"
            ref={tituloRef}
            value={formulario.titulo}
            onChange={cambiar}
            aria-invalid={Boolean(errores.titulo)}
            aria-describedby={descritoPor('titulo', true, errores.titulo)}
            autoComplete="off"
          />
        </Campo>

        <Campo
          id="descripcion"
          etiqueta="Descripción"
          ayuda="Qué hay que entregar o hacer."
          error={errores.descripcion}
        >
          <input
            id="descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={cambiar}
            aria-invalid={Boolean(errores.descripcion)}
            aria-describedby={descritoPor('descripcion', true, errores.descripcion)}
          />
        </Campo>

        <Campo
          id="pesoTarea"
          etiqueta="Peso"
          ayuda="Esfuerzo de la tarea. 1 es poco y 13 es mucho. Junto con la materia define la prioridad."
          error={errores.pesoTarea}
        >
          <select
            id="pesoTarea"
            name="pesoTarea"
            value={formulario.pesoTarea === '' ? '' : String(formulario.pesoTarea)}
            onChange={cambiar}
            aria-invalid={Boolean(errores.pesoTarea)}
            aria-describedby={descritoPor('pesoTarea', true, errores.pesoTarea)}
          >
            <option value="">Elegir peso</option>
            {PESOS.map((peso) => (
              <option key={peso} value={peso}>{peso}</option>
            ))}
          </select>
        </Campo>

        <Campo
          id="fechaEntrega"
          etiqueta="Fecha de entrega"
          ayuda="Día y hora. Si ya pasó y el estado es Pendiente, el sistema la marcará vencida."
          error={errores.fechaEntrega}
        >
          <input
            id="fechaEntrega"
            name="fechaEntrega"
            type="datetime-local"
            value={formulario.fechaEntrega}
            onChange={cambiar}
            aria-invalid={Boolean(errores.fechaEntrega)}
            aria-describedby={descritoPor('fechaEntrega', true, errores.fechaEntrega)}
          />
        </Campo>

        <Campo
          id="estado"
          etiqueta="Estado"
          ayuda="Vencida no se elige: la pone el sistema."
          error={errores.estado}
        >
          <select
            id="estado"
            name="estado"
            value={formulario.estado}
            onChange={cambiar}
            aria-invalid={Boolean(errores.estado)}
            aria-describedby={descritoPor('estado', true, errores.estado)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Activa">Activa</option>
            <option value="Completada">Completada</option>
            <option value="Vencida" disabled>Vencida</option>
          </select>
        </Campo>

        <Campo
          id="idMateria"
          etiqueta="Materia"
          ayuda="De 8 a 10 la materia tiene alto impacto."
          error={errores.idMateria}
        >
          <select
            id="idMateria"
            name="idMateria"
            value={formulario.idMateria}
            onChange={cambiar}
            aria-invalid={Boolean(errores.idMateria)}
            aria-describedby={descritoPor('idMateria', true, errores.idMateria)}
          >
            <option value="">Elegir materia</option>
            {materias.map((materia) => (
              <option key={materia.idMateria} value={materia.idMateria}>
                {materia.nombreMateria} · prioridad {materia.prioridadMateria}
              </option>
            ))}
          </select>
        </Campo>

        {aviso && <p className="aviso-linea" role="status">{aviso}</p>}

        <div className="fila-botones fila-ancha">
          <button type="submit" className="boton boton-primario" disabled={guardando}>
            {guardando ? 'Guardando…' : editando ? 'Actualizar tarea' : 'Guardar tarea'}
          </button>
          {editando && (
            <button type="button" className="boton boton-secundario" onClick={onCancelar}>
              Cancelar
            </button>
          )}
          {!editando && (
            <button
              type="button"
              className="boton boton-secundario"
              onClick={() => {
                setFormulario(VACIO);
                setErrores({});
              }}
            >
              Limpiar
            </button>
          )}
        </div>
      </form>
    </section>
  );
});

export default FormularioTarea;
