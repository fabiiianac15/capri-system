import axios from '../lib/axios';
import type {
  AplicacionMedicamento,
  CreateAplicacionData,
  ProximaDosis,
} from '../types';

// ========================================
// SERVICIOS DE APLICACIONES
// ========================================

export const aplicacionService = {
  // Obtener todas las aplicaciones
  async getAll(filters?: {
    goatId?: string;
    medicamentoId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AplicacionMedicamento[]> {
    const params = new URLSearchParams();
    if (filters?.goatId) params.append('goatId', filters.goatId);
    if (filters?.medicamentoId) params.append('medicamentoId', filters.medicamentoId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await axios.get(`/aplicaciones?${params.toString()}`);
    return response.data;
  },

  // Obtener aplicación por ID
  async getById(id: string): Promise<AplicacionMedicamento> {
    const response = await axios.get(`/aplicaciones/${id}`);
    return response.data;
  },

  // Obtener próximas dosis
  async getProximasDosis(dias: number = 30): Promise<ProximaDosis[]> {
    const response = await axios.get(`/aplicaciones/proximas-dosis?dias=${dias}`);
    return response.data;
  },

  // Obtener estadísticas
  async getEstadisticas(filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await axios.get(`/aplicaciones/estadisticas?${params.toString()}`);
    return response.data;
  },

  // Crear aplicación
  async create(data: CreateAplicacionData): Promise<AplicacionMedicamento> {
    const response = await axios.post('/aplicaciones', data);
    return response.data;
  },

  // Crear aplicación masiva
  async createBulk(
    goatIds: string[],
    aplicacionData: Omit<CreateAplicacionData, 'goatId'>
  ): Promise<AplicacionMedicamento[]> {
    const response = await axios.post('/aplicaciones/bulk', {
      goatIds,
      ...aplicacionData,
    });
    return response.data;
  },

  // Actualizar aplicación
  async update(id: string, data: Partial<CreateAplicacionData>): Promise<AplicacionMedicamento> {
    const response = await axios.put(`/aplicaciones/${id}`, data);
    return response.data;
  },

  // Eliminar aplicación
  async delete(id: string): Promise<void> {
    await axios.delete(`/aplicaciones/${id}`);
  },

  // Obtener historial médico de una cabra
  async getHistorialMedico(goatId: string): Promise<AplicacionMedicamento[]> {
    const response = await axios.get(`/aplicaciones?goatId=${goatId}`);
    return response.data;
  },
};

export default aplicacionService;
