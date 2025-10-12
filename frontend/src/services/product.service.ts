import api from '../lib/axios';

// ========================================
// INTERFACES
// ========================================
export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  currentStock: number;
  minStock: number;
  unit: string;
  price: number;
  location?: string | null;
  expirationDate?: Date | null;
  supplierId: string;
  supplier?: {
    id: string;
    name: string;
    city?: {
      name: string;
      state?: {
        name: string;
        country?: {
          name: string;
        };
      };
    };
  };
  outputs?: InventoryOutput[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryOutput {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  notes?: string | null;
  date: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
  };
}

export interface CreateProductDTO {
  name: string;
  category: string;
  description?: string;
  currentStock: number;
  minStock: number;
  unit: string;
  price: number;
  location?: string;
  expirationDate?: string; // ISO string
  supplierId: string;
}

export interface UpdateProductDTO {
  name?: string;
  category?: string;
  description?: string;
  currentStock?: number;
  minStock?: number;
  unit?: string;
  price?: number;
  location?: string;
  expirationDate?: string; // ISO string
  supplierId?: string;
}

export interface CreateOutputDTO {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface ProductStats {
  totalProducts: number;
  lowStockProducts: number;
  byCategory: Record<string, number>;
  totalValue: number;
}

// ========================================
// CATEGORÍAS DE PRODUCTOS
// ========================================
export const PRODUCT_CATEGORIES = [
  'Alimento',
  'Medicamento',
  'Vacuna',
  'Suplemento',
  'Equipo',
  'Otro'
] as const;

// ========================================
// SERVICIO
// ========================================
export const productService = {
  // Obtener todos los productos
  async getAll(): Promise<Product[]> {
    const { data } = await api.get('/products');
    return data;
  },

  // Obtener producto por ID
  async getById(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  // Crear producto
  async create(productData: CreateProductDTO): Promise<Product> {
    const { data } = await api.post('/products', productData);
    return data;
  },

  // Actualizar producto
  async update(id: string, productData: UpdateProductDTO): Promise<Product> {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  // Eliminar producto
  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Registrar salida de inventario
  async createOutput(outputData: CreateOutputDTO): Promise<InventoryOutput> {
    const { data } = await api.post('/products/outputs', outputData);
    return data;
  },

  // Obtener salidas de un producto
  async getOutputs(productId: string): Promise<InventoryOutput[]> {
    const { data } = await api.get(`/products/${productId}/outputs`);
    return data;
  },

  // Obtener productos con stock bajo
  async getLowStock(): Promise<Product[]> {
    const { data } = await api.get('/products/low-stock');
    return data;
  },

  // Obtener estadísticas
  async getStats(): Promise<ProductStats> {
    const { data } = await api.get('/products/stats');
    return data;
  }
};
