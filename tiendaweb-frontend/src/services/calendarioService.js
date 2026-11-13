import { apiGet, apiPut } from './apiClient';

export async function obtenerMes(usuarioId, year, mes) {
  await apiPut(`/GestionCalendario/setuserid?id=${encodeURIComponent(usuarioId)}`);
  await apiPut('/GestionCalendario/RefrescarCalendario');
  return apiGet(`/GestionCalendario/ObtenerDiasdeunMes?year=${year}&mes=${mes}`);
}
