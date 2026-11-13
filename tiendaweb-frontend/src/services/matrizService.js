import { apiGet, apiPut } from './apiClient';

export async function obtenerMatriz(usuarioId) {
  await apiPut(`/GestionImpactoEsfuerzo/SetUser?id=${encodeURIComponent(usuarioId)}`);
  await apiPut('/GestionImpactoEsfuerzo/asignar-impactoesfuerzo');
  const [oportunidades, gananciaRapida, menorGanancia, descartar] = await Promise.all([
    apiGet('/GestionImpactoEsfuerzo/tareas-oportunidades'),
    apiGet('/GestionImpactoEsfuerzo/tareas-gananciarapida'),
    apiGet('/GestionImpactoEsfuerzo/tareas-menorgan'),
    apiGet('/GestionImpactoEsfuerzo/tareas-descartar'),
  ]);

  return {
    oportunidades: oportunidades || [],
    ganancia_rapida: gananciaRapida || [],
    menor_ganancia: menorGanancia || [],
    minima: descartar || [],
  };
}
