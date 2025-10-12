import api from '../lib/axios';
import type { Goat, CreateGoatData, UpdateGoatData, GoatStats } from '../types/index';

interface GetAllParams {
  category?: string;
  breed?: string;
  status?: string;
  sex?: string;
}

class GoatService {
  async create(data: CreateGoatData): Promise<Goat> {
    const response = await api.post<{ data: Goat }>('/goats', data);
    return response.data.data;
  }

  async getAll(params?: GetAllParams): Promise<Goat[]> {
    const response = await api.get<{ data: Goat[] }>('/goats', { params });
    return response.data.data;
  }

  async getById(id: string): Promise<Goat> {
    const response = await api.get<{ data: Goat }>(`/goats/${id}`);
    return response.data.data;
  }

  async getByCustomId(customId: string): Promise<Goat> {
    const response = await api.get<{ data: Goat }>(`/goats/custom/${customId}`);
    return response.data.data;
  }

  async update(id: string, data: UpdateGoatData): Promise<Goat> {
    const response = await api.put<{ data: Goat }>(`/goats/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<Goat> {
    const response = await api.delete<{ data: Goat }>(`/goats/${id}`);
    return response.data.data;
  }

  async getStats(): Promise<GoatStats> {
    const response = await api.get<{ data: GoatStats }>('/goats/stats');
    return response.data.data;
  }

  async updateCategoryByWeight(id: string): Promise<Goat> {
    const response = await api.patch<{ data: Goat }>(`/goats/${id}/update-category`);
    return response.data.data;
  }
}

export default new GoatService();
