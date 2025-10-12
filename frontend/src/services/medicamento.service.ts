import axios from '../lib/axios';
import type {
  Medicamento,
  CreateMedicamentoData,
  UpdateMedicamentoData,
  AlertaMedicamento,
  EstadisticasMedicamentos,
} from '../types';

// ========================================
// SERVICIOS DE MEDICAMENTOS
// ========================================

export const medicamentoService = {
  // Obtener todos los medicamentos
  async getAll(filters?: {
    tipo?: string;
    activo?: boolean;
  }): Promise<Medicamento[]> {
    const params = new URLSearchParams();
    if (filters?.tipo) params.append('tipo', filters.tipo);
    if (filters?.activo !== undefined) params.append('activo', String(filters.activo));

    const response = await axios.get(`/medicamentos?${params.toString()}`);
    return response.data;
  },

  // Obtener medicamento por ID
  async getById(id: string): Promise<Medicamento> {
    const response = await axios.get(`/medicamentos/${id}`);
    return response.data;
  },

  // Obtener alertas
  async getAlertas(): Promise<AlertaMedicamento[]> {
    const response = await axios.get('/medicamentos/alertas');
    return response.data;
  },

  // Obtener estadísticas
  async getEstadisticas(): Promise<EstadisticasMedicamentos> {
    const response = await axios.get('/medicamentos/estadisticas');
    return response.data;
  },

  // Crear medicamento
  async create(data: CreateMedicamentoData): Promise<Medicamento> {
    const response = await axios.post('/medicamentos', data);
    return response.data;
  },

  // Actualizar medicamento
  async update(id: string, data: UpdateMedicamentoData): Promise<Medicamento> {
    const response = await axios.put(`/medicamentos/${id}`, data);
    return response.data;
  },

  // Actualizar stock
  async updateStock(
    id: string,
    cantidad: number,
    operacion: 'INCREMENTAR' | 'DECREMENTAR'
  ): Promise<Medicamento> {
    const response = await axios.patch(`/medicamentos/${id}/stock`, {
      cantidad,
      operacion,
    });
    return response.data;
  },

  // Eliminar medicamento
  async delete(id: string): Promise<void> {
    await axios.delete(`/medicamentos/${id}`);
  },
};

export default medicamentoService;
