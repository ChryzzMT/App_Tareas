import { useState } from 'react';
import Marco from '../components/Marco';
import FormularioMateria from '../components/FormularioMateria';
import DialogoConfirmacion from '../components/DialogoConfirmacion';
import Cargando from '../components/Cargando';
import EstadoVacio from '../components/EstadoVacio';
import { useTareas } from '../hooks/useTareas';

export default function PaginaMaterias() {
  const { materias, cargando, ocupado, error, recargar, guardarMateria, quitarMateria } = useTareas();
  const [materiaEnEdicion, setMateriaEnEdicion] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  return (
    <Marco titulo="Materias">
      <p className="intro">
        La prioridad de la materia es el impacto. Una materia de 8, 9 o 10 empuja sus tareas livianas a Oportunidades.
      </p>
      {error && (
        <div className="banner-error" role="alert">
          <p>{error}</p>
          <button type="button" className="boton boton-secundario" onClick={recargar}>Reintentar</button>
        </div>
      )}
      <FormularioMateria
        materiaEnEdicion={materiaEnEdicion}
        guardando={ocupado}
        onGuardar={async (datos) => {
          await guardarMateria(datos);
          setMateriaEnEdicion(null);
        }}
        onCancelar={() => setMateriaEnEdicion(null)}
      />
      {cargando && <Cargando texto="Cargando materias…" />}
      {!cargando && materias.length === 0 && (
        <EstadoVacio
          titulo="Aún no hay materias"
          texto="Crea al menos una. Después podrás colgarle tareas y ver la matriz."
        />
      )}
      {materias.length > 0 && (
        <ul className="lista-materias">
          {materias.map((materia) => (
            <li key={materia.idMateria} className="tarjeta tarjeta-fuera">
              <h2>{materia.nombreMateria}</h2>
              <p>
                <span className="prioridad prioridad-menor_ganancia">
                  <span className="prioridad-forma forma-cuadrado" aria-hidden="true" />
                  Prioridad {materia.prioridadMateria} de 10
                </span>
              </p>
              <div className="fila-botones">
                <button type="button" className="boton boton-secundario" onClick={() => setMateriaEnEdicion(materia)}>
                  Editar prioridad
                </button>
                <button type="button" className="boton boton-peligro-linea" onClick={() => setConfirmacion(materia)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <DialogoConfirmacion
        abierto={Boolean(confirmacion)}
        titulo="Eliminar materia"
        mensaje={confirmacion ? `¿Eliminar «${confirmacion.nombreMateria}»?` : ''}
        detalle="Se eliminan también todas las tareas de esa materia y sus subtareas. Esta acción no se puede deshacer."
        textoConfirmar="Eliminar materia"
        onCancelar={() => setConfirmacion(null)}
        onConfirmar={async () => {
          const nombre = confirmacion.nombreMateria;
          setConfirmacion(null);
          await quitarMateria(nombre);
          setMateriaEnEdicion(null);
        }}
      />
    </Marco>
  );
}
