import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Avisos from '../components/Avisos';
import { AvisosProvider } from '../context/AvisosContext';
import { SesionProvider } from '../context/SesionContext';
import { TareasProvider } from '../context/TareasContext';
import PaginaTareas from '../pages/PaginaTareas';

const { db } = vi.hoisted(() => ({
  db: {
    secuencia: 4,
    materias: [{ idMateria: 1, nombreMateria: 'IHC', prioridadMateria: 9, idUsuario: 1 }],
    pendientes: [],
    completadas: [],
    vencidas: [],
  },
}));

vi.mock('../services/tareasService', () => ({
  establecerUsuarioTareas: vi.fn(async () => null),
  listarPendientes: vi.fn(async () => db.pendientes.map((tarea) => ({ ...tarea }))),
  listarCompletadas: vi.fn(async () => db.completadas.map((tarea) => ({ ...tarea }))),
  listarVencidas: vi.fn(async () => db.vencidas.map((tarea) => ({ ...tarea }))),
  listarParaRevision: vi.fn(async () => []),
  crearTarea: vi.fn(async (tarea) => {
    db.pendientes.push({
      ...tarea,
      idTarea: db.secuencia,
      materia: db.materias[0],
    });
    db.secuencia += 1;
  }),
  actualizarTarea: vi.fn(async (tarea) => {
    db.pendientes = db.pendientes.map((item) => (
      item.idTarea === Number(tarea.idTarea) ? { ...item, ...tarea, materia: db.materias[0] } : item
    ));
  }),
  eliminarTareaPorTitulo: vi.fn(async (titulo) => {
    db.pendientes = db.pendientes.filter((item) => item.titulo !== titulo);
  }),
  marcarCompletada: vi.fn(async () => null),
}));

vi.mock('../services/materiasService', () => ({
  establecerUsuarioMaterias: vi.fn(async () => null),
  listarMaterias: vi.fn(async () => db.materias.map((materia) => ({ ...materia }))),
  crearMateria: vi.fn(async () => null),
  actualizarMateria: vi.fn(async () => null),
  eliminarMateria: vi.fn(async () => null),
}));

vi.mock('../services/subtareasService', () => ({
  establecerUsuarioSubtareas: vi.fn(async () => null),
  listarSubtareas: vi.fn(async () => []),
  crearSubtarea: vi.fn(async () => null),
  eliminarSubtarea: vi.fn(async () => null),
  actualizarDescripcionSubtarea: vi.fn(async () => null),
}));

function renderizar() {
  localStorage.setItem('usuarioId', '1');
  localStorage.setItem('usuarioNombre', 'Ana');
  return render(
    <AvisosProvider>
      <SesionProvider>
        <TareasProvider>
          <MemoryRouter initialEntries={['/tareas']}>
            <Avisos />
            <PaginaTareas />
          </MemoryRouter>
        </TareasProvider>
      </SesionProvider>
    </AvisosProvider>,
  );
}

describe('flujo de tareas', () => {
  beforeEach(() => {
    db.secuencia = 4;
    db.pendientes = [];
    db.completadas = [];
    db.vencidas = [];
  });

  it('no guarda una tarea vacía y dice qué falta', async () => {
    const usuario = userEvent.setup();
    renderizar();
    const materia = await screen.findByLabelText('Materia');
    await within(materia).findByRole('option', { name: /IHC/ });
    await usuario.click(screen.getByRole('button', { name: 'Guardar tarea' }));
    expect(screen.getByText(/Escribe un título/)).toBeInTheDocument();
    expect(screen.getByText(/Elige un peso/)).toBeInTheDocument();
    expect(screen.getByText(/Elige una materia/)).toBeInTheDocument();
  });

  it('crea, edita y elimina una tarea mostrando su prioridad', async () => {
    const usuario = userEvent.setup();
    renderizar();
    const materia = await screen.findByLabelText('Materia');
    await within(materia).findByRole('option', { name: /IHC/ });

    await usuario.type(screen.getByLabelText('Título'), 'Ensayo de IHC');
    await usuario.type(screen.getByLabelText('Descripción'), 'Redactar la introducción');
    await usuario.selectOptions(screen.getByLabelText('Peso'), '2');
    fireEvent.change(screen.getByLabelText('Fecha de entrega'), { target: { value: '2027-06-01T10:00' } });
    await usuario.selectOptions(screen.getByLabelText('Materia'), '1');
    await usuario.click(screen.getByRole('button', { name: 'Guardar tarea' }));

    const tarjeta = await screen.findByRole('article', { name: 'Ensayo de IHC' });
    expect(within(tarjeta).getByText('Oportunidades')).toBeInTheDocument();
    expect(within(tarjeta).getByText('Pendiente')).toBeInTheDocument();
    expect(within(tarjeta).getByText(/prioridad 9/)).toBeInTheDocument();

    await usuario.click(within(tarjeta).getByRole('button', { name: 'Editar' }));
    const titulo = screen.getByLabelText('Título');
    await usuario.clear(titulo);
    await usuario.type(titulo, 'Ensayo corregido');
    await usuario.click(screen.getByRole('button', { name: 'Actualizar tarea' }));

    const editada = await screen.findByRole('article', { name: 'Ensayo corregido' });
    expect(screen.queryByRole('article', { name: 'Ensayo de IHC' })).not.toBeInTheDocument();

    await usuario.click(within(editada).getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByRole('dialog', { name: 'Eliminar tarea' })).toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByRole('article', { name: 'Ensayo corregido' })).toBeInTheDocument();

    await usuario.click(within(screen.getByRole('article', { name: 'Ensayo corregido' })).getByRole('button', { name: 'Eliminar' }));
    await usuario.click(screen.getByRole('button', { name: 'Eliminar tarea' }));
    expect(await screen.findByText(/Se eliminó/)).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'Ensayo corregido' })).not.toBeInTheDocument();
  });
});
