import axios from '../lib/axios';
import type {
  Monta,
  CreateMontaData,
  RegistrarPartoData,
  GestacionActiva,
  EstadisticasReproduccion,
} from '../types';

// ========================================
// SERVICIOS DE MONTAS (REPRODUCCIÓN)
// ========================================

export const montaService = {
  // Obtener todas las montas
  async getAll(filters?: {
    hembraId?: string;
    machoId?: string;
    tipoEvento?: string;
  }): Promise<Monta[]> {
    const params = new URLSearchParams();
    if (filters?.hembraId) params.append('hembraId', filters.hembraId);
    if (filters?.machoId) params.append('machoId', filters.machoId);
    if (filters?.tipoEvento) params.append('tipoEvento', filters.tipoEvento);

    const response = await axios.get(`/montas?${params.toString()}`);
    return response.data;
  },

  // Obtener monta por ID
  async getById(id: string): Promise<Monta> {
    const response = await axios.get(`/montas/${id}`);
    return response.data;
  },

  // Obtener gestaciones activas
  async getGestacionesActivas(): Promise<GestacionActiva[]> {
    const response = await axios.get('/montas/gestaciones-activas');
    return response.data;
  },

  // Obtener próximos partos
  async getProximosPartos(dias: number = 30): Promise<Monta[]> {
    const response = await axios.get(`/montas/proximos-partos?dias=${dias}`);
    return response.data;
  },

  // Obtener estadísticas
  async getEstadisticas(filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<EstadisticasReproduccion> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await axios.get(`/montas/estadisticas?${params.toString()}`);
    return response.data;
  },

  // Obtener historial de una hembra
  async getHistorialHembra(hembraId: string): Promise<{
    montas: Monta[];
    estadisticas: any;
  }> {
    const response = await axios.get(`/montas/historial/hembra/${hembraId}`);
    return response.data;
  },

  // Obtener historial de un macho
  async getHistorialMacho(machoId: string): Promise<{
    montas: Monta[];
    estadisticas: any;
  }> {
    const response = await axios.get(`/montas/historial/macho/${machoId}`);
    return response.data;
  },

  // Crear monta
  async create(data: CreateMontaData): Promise<Monta> {
    const response = await axios.post('/montas', data);
    return response.data;
  },

  // Registrar parto
  async registrarParto(montaId: string, data: RegistrarPartoData): Promise<Monta> {
    const response = await axios.post(`/montas/${montaId}/parto`, data);
    return response.data;
  },

  // Registrar aborto
  async registrarAborto(
    montaId: string,
    data: {
      fechaAborto: string;
      motivo?: string;
      observaciones?: string;
    }
  ): Promise<Monta> {
    const response = await axios.post(`/montas/${montaId}/aborto`, data);
    return response.data;
  },

  // Actualizar monta
  async update(id: string, data: Partial<Monta>): Promise<Monta> {
    const response = await axios.put(`/montas/${id}`, data);
    return response.data;
  },

  // Eliminar monta
  async delete(id: string): Promise<void> {
    await axios.delete(`/montas/${id}`);
  },
};

export default montaService;
