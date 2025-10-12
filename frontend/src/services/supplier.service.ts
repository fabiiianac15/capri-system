import api from '../lib/axios';

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
  country?: Country;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  state?: State;
}

export interface Supplier {
  id: string;
  name: string;
  nit?: string;
  phone?: string;
  email?: string;
  address?: string;
  cityId?: string;
  city?: City & {
    state?: State & {
      country?: Country;
    };
  };
  products?: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDTO {
  name: string;
  nit?: string;
  phone?: string;
  email?: string;
  address?: string;
  cityId?: string;
}

export interface UpdateSupplierDTO {
  name?: string;
  nit?: string;
  phone?: string;
  email?: string;
  address?: string;
  cityId?: string;
}

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const response = await api.get('/suppliers');
    return response.data;
  },

  async getById(id: string): Promise<Supplier> {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  async create(data: CreateSupplierDTO): Promise<Supplier> {
    const response = await api.post('/suppliers', data);
    return response.data;
  },

  async update(id: string, data: UpdateSupplierDTO): Promise<Supplier> {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/suppliers/${id}`);
  },

  // Métodos para cascada de ubicación
  async getCountries(): Promise<Country[]> {
    const response = await api.get('/suppliers/locations/countries');
    return response.data;
  },

  async getStatesByCountry(countryId: string): Promise<State[]> {
    const response = await api.get(`/suppliers/locations/states/${countryId}`);
    return response.data;
  },

  async getCitiesByState(stateId: string): Promise<City[]> {
    const response = await api.get(`/suppliers/locations/cities/${stateId}`);
    return response.data;
  }
};
