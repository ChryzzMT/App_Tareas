import { describe, expect, it } from 'vitest';
import { desplazamientoPrimeraSemana } from '../logic/calendarioVista';
import {
  clasificarTarea,
  esCandidataAVencida,
  esTareaEnCurso,
  estadoTrasMarcar,
} from '../logic/priorizacion';
import { validarCuenta, validarTarea } from '../logic/validacion';
import { prepararLista } from '../logic/vista';

const ahora = new Date(2026, 10, 13, 12, 0, 0);
const materiaAlta = { idMateria: 1, nombreMateria: 'IHC', prioridadMateria: 9 };
const materiaMedia = { idMateria: 2, nombreMateria: 'Cálculo', prioridadMateria: 5 };
const materiaBaja = { idMateria: 3, nombreMateria: 'Taller', prioridadMateria: 2 };

function tarea(parcial) {
  return {
    estado: 'Pendiente',
    fechaEntrega: '2026-12-01T10:00',
    pesoTarea: 2,
    idMateria: 1,
    ...parcial,
  };
}

describe('clasificación de impacto y esfuerzo', () => {
  it('manda a oportunidades una materia alta con poco peso', () => {
    expect(clasificarTarea(tarea({ pesoTarea: 1 }), materiaAlta, ahora)).toBe('oportunidades');
    expect(clasificarTarea(tarea({ pesoTarea: 3 }), materiaAlta, ahora)).toBe('oportunidades');
  });

  it('manda a ganancia rápida el peso alto en materias altas o medias', () => {
    expect(clasificarTarea(tarea({ pesoTarea: 5 }), materiaAlta, ahora)).toBe('ganancia_rapida');
    expect(clasificarTarea(tarea({ pesoTarea: 13, idMateria: 2 }), materiaMedia, ahora)).toBe('ganancia_rapida');
  });

  it('manda a menor ganancia el peso 2 o 3 de una materia media', () => {
    expect(clasificarTarea(tarea({ pesoTarea: 2, idMateria: 2 }), materiaMedia, ahora)).toBe('menor_ganancia');
    expect(clasificarTarea(tarea({ pesoTarea: 3, idMateria: 2 }), materiaMedia, ahora)).toBe('menor_ganancia');
  });

  it('manda a descartar el peso bajo de una materia media y todo lo de prioridad baja', () => {
    expect(clasificarTarea(tarea({ pesoTarea: 1, idMateria: 2 }), materiaMedia, ahora)).toBe('minima');
    expect(clasificarTarea(tarea({ pesoTarea: 8, idMateria: 3 }), materiaBaja, ahora)).toBe('minima');
    expect(clasificarTarea(tarea({ pesoTarea: 1, idMateria: 3 }), materiaBaja, ahora)).toBe('minima');
    expect(clasificarTarea(tarea({ pesoTarea: 4 }), materiaAlta, ahora)).toBe('minima');
  });

  it('no clasifica completadas, vencidas, sin materia ni fechas que no pasan de hoy', () => {
    expect(clasificarTarea(tarea({ estado: 'Completada' }), materiaAlta, ahora)).toBeNull();
    expect(clasificarTarea(tarea({ estado: 'VENCIDA' }), materiaAlta, ahora)).toBeNull();
    expect(clasificarTarea(tarea(), null, ahora)).toBeNull();
    const medianoche = new Date(2026, 10, 13, 0, 0, 0);
    expect(clasificarTarea(tarea({ fechaEntrega: medianoche }), materiaAlta, ahora)).toBeNull();
  });

  it('trata un peso vacío como no comparable y cae en descartar', () => {
    expect(clasificarTarea(tarea({ pesoTarea: null }), materiaAlta, ahora)).toBe('minima');
  });
});

describe('estados que decide el servidor', () => {
  it('al marcar una hecha o vencida vuelve a pendiente dentro de cinco días', () => {
    const resultado = estadoTrasMarcar({ estado: 'Completada', fechaEntrega: '2026-01-01' }, ahora);
    expect(resultado.estado).toBe('Pendiente');
    expect(resultado.fechaEntrega.getDate()).toBe(18);
    expect(estadoTrasMarcar(tarea(), ahora).estado).toBe('Completada');
  });

  it('solo vence lo pendiente con fecha pasada, y en curso exige fecha futura', () => {
    expect(esCandidataAVencida(tarea({ fechaEntrega: '2026-11-01T08:00' }), ahora)).toBe(true);
    expect(esCandidataAVencida(tarea({ estado: 'Activa', fechaEntrega: '2026-11-01T08:00' }), ahora)).toBe(false);
    expect(esTareaEnCurso(tarea({ fechaEntrega: '2026-11-13T08:00' }), ahora)).toBe(false);
    expect(esTareaEnCurso(tarea(), ahora)).toBe(true);
  });
});

describe('validación y calendario', () => {
  it('impide guardar una tarea incompleta y explica cómo corregirla', () => {
    const errores = validarTarea({
      titulo: '',
      descripcion: '',
      pesoTarea: '',
      fechaEntrega: '',
      estado: 'Pendiente',
      idMateria: '',
    });
    expect(errores.titulo).toMatch(/título/i);
    expect(errores.pesoTarea).toMatch(/1, 2, 3, 5, 8 o 13/);
    expect(errores.idMateria).toMatch(/materia/i);
  });

  it('pide una contraseña de 8 a 18 caracteres', () => {
    expect(validarCuenta({ nombre: 'Ana', email: 'ana@correo.com', contrasena: 'corta' }).contrasena).toMatch(/8 y 18/);
    expect(validarCuenta({ nombre: 'Ana', email: 'ana@correo.com', contrasena: 'clave-segura' })).toEqual({});
  });

  it('deja el domingo en la última columna', () => {
    expect(desplazamientoPrimeraSemana([{ diadelsemana: 0 }])).toBe(6);
    expect(desplazamientoPrimeraSemana([{ diadelsemana: 1 }])).toBe(0);
  });

  it('ordena por importancia del cuadrante antes que por la fecha', () => {
    const materias = [materiaAlta];
    const lista = [
      tarea({ idTarea: 1, titulo: 'Pesada', pesoTarea: 8, fechaEntrega: '2026-11-20T10:00' }),
      tarea({ idTarea: 2, titulo: 'Ligera', pesoTarea: 1, fechaEntrega: '2026-12-20T10:00' }),
    ];
    const ordenada = prepararLista(lista, {
      texto: '', mostrar: 'todas', materia: 'todas', cuadrante: 'todos', orden: 'importancia',
    }, materias, ahora);
    expect(ordenada.map((item) => item.titulo)).toEqual(['Ligera', 'Pesada']);
  });
});
