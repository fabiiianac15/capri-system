import api from '../lib/axios';

export type ProductType = 'CARNE' | 'LECHE' | 'CABRA_VIVA' | 'PRODUCTO_ELABORADO';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';

export interface Sale {
  id: string;
  productType: ProductType;
  customerName: string;
  customerId?: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  userId: string;
  goatId?: string | null;
  notes?: string | null;
  saleDate: Date;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  goat?: {
    id: string;
    customId: string;
    name?: string;
    breed: string;
  } | null;
}

export interface CreateSaleDTO {
  productType: ProductType;
  customerName: string;
  customerId?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  goatId?: string;
  notes?: string;
  saleDate?: string;
}

export interface UpdateSaleDTO {
  productType?: ProductType;
  customerName?: string;
  customerId?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  amountPaid?: number;
  goatId?: string;
  notes?: string;
  saleDate?: string;
}

export const saleService = {
  async getAll(filters?: {
    productType?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Sale[]> {
    const { data } = await api.get('/sales', { params: filters });
    return data.data;
  },

  async getById(id: string): Promise<Sale> {
    const { data } = await api.get(`/sales/${id}`);
    return data.data;
  },

  async create(saleData: CreateSaleDTO): Promise<Sale> {
    const { data } = await api.post('/sales', saleData);
    return data.data;
  },

  async update(id: string, saleData: UpdateSaleDTO): Promise<Sale> {
    const { data } = await api.put(`/sales/${id}`, saleData);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/sales/${id}`);
  },

  async getStats(): Promise<any> {
    const { data } = await api.get('/sales/stats');
    return data.data;
  }
};
