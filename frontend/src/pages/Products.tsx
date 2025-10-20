import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { 
  Eye, 
  Edit2, 
  Trash2, 
  Plus, 
  X, 
  Filter, 
  Search,
  Package,
  TrendingDown,
  Calendar,
  DollarSign,
  MapPin,
  Building2,
  ArrowDownCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import type { 
  Product, 
  CreateProductDTO, 
  UpdateProductDTO,
  CreateOutputDTO
} from '../services/product.service';
import { 
  productService,
  PRODUCT_CATEGORIES 
} from '../services/product.service';
import type { Supplier } from '../services/supplier.service';
import { supplierService } from '../services/supplier.service';

// ========================================
// HELPER FUNCTIONS
// ========================================
const getStockStatus = (current: number, min: number) => {
  if (current > min) return { label: 'Normal', color: 'green' };
  if (current === min) return { label: 'Bajo', color: 'yellow' };
  if (current < min && current > min / 2) return { label: 'Bajo', color: 'yellow' };
  return { label: 'Crítico', color: 'red' };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-CO');
};

const isExpiringSoon = (date: Date | string | null | undefined) => {
  if (!date) return false;
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 30; // Próximo a vencer en 30 días
};

const isExpired = (date: Date | string | null | undefined) => {
  if (!date) return false;
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
export default function Products() {
  // Estados de datos
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Estados de modales
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  
  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    supplierId: '',
    expirationStatus: ''
  });
  
  // Estados de formularios
  const [formData, setFormData] = useState<CreateProductDTO>({
    name: '',
    category: '',
    description: '',
    currentStock: 0,
    minStock: 0,
    unit: '',
    price: 0,
    location: '',
    expirationDate: '',
    supplierId: ''
  });
  
  const [outputFormData, setOutputFormData] = useState<CreateOutputDTO>({
    productId: '',
    quantity: 0,
    notes: ''
  });
  
  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [registering, setRegistering] = useState(false);

  // ========================================
  // EFECTOS
  // ========================================
  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  // ========================================
  // FUNCIONES DE API
  // ========================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await productService.create(formData);
      alert('Producto creado exitosamente');
      setCreateOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    try {
      setUpdating(true);
      const updateData: UpdateProductDTO = { ...formData };
      await productService.update(selectedProduct.id, updateData);
      alert('Producto actualizado exitosamente');
      setEditOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      setDeleting(true);
      await productService.delete(selectedProduct.id);
      alert('Producto eliminado exitosamente');
      setDeleteConfirmOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    } finally {
      setDeleting(false);
    }
  };

  const handleRegisterOutput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    try {
      setRegistering(true);
      await productService.createOutput(outputFormData);
      alert('Salida registrada exitosamente');
      setOutputOpen(false);
      resetOutputForm();
      fetchProducts();
    } catch (error) {
      console.error('Error registering output:', error);
      alert('Error al registrar la salida');
    } finally {
      setRegistering(false);
    }
  };

  // ========================================
  // FUNCIONES DE UI
  // ========================================
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      currentStock: product.currentStock,
      minStock: product.minStock,
      unit: product.unit,
      price: product.price,
      location: product.location || '',
      expirationDate: product.expirationDate 
        ? new Date(product.expirationDate).toISOString().split('T')[0]
        : '',
      supplierId: product.supplierId || ''
    });
    setEditOpen(true);
  };

  const openOutputDialog = (product: Product) => {
    setSelectedProduct(product);
    setOutputFormData({
      productId: product.id,
      quantity: 0,
      notes: ''
    });
    setOutputOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      currentStock: 0,
      minStock: 0,
      unit: '',
      price: 0,
      location: '',
      expirationDate: '',
      supplierId: ''
    });
    setSelectedProduct(null);
  };

  const resetOutputForm = () => {
    setOutputFormData({
      productId: '',
      quantity: 0,
      notes: ''
    });
    setSelectedProduct(null);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      stockStatus: '',
      supplierId: '',
      expirationStatus: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'minStock' || name === 'price'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleOutputInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOutputFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  // ========================================
  // PRODUCTOS FILTRADOS
  // ========================================
  const filteredProducts = products.filter(product => {
    // Búsqueda
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.supplier?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Filtro de categoría
    if (filters.category && product.category !== filters.category) return false;

    // Filtro de estado de stock
    if (filters.stockStatus) {
      const status = getStockStatus(product.currentStock, product.minStock);
      if (filters.stockStatus === 'normal' && status.label !== 'Normal') return false;
      if (filters.stockStatus === 'low' && status.label !== 'Bajo') return false;
      if (filters.stockStatus === 'critical' && status.label !== 'Crítico') return false;
    }

    // Filtro de proveedor
    if (filters.supplierId && product.supplierId !== filters.supplierId) return false;

    // Filtro de vencimiento
    if (filters.expirationStatus) {
      if (filters.expirationStatus === 'expiring' && !isExpiringSoon(product.expirationDate)) return false;
      if (filters.expirationStatus === 'expired' && !isExpired(product.expirationDate)) return false;
      if (filters.expirationStatus === 'valid' && (isExpired(product.expirationDate) || !product.expirationDate)) return false;
    }

    return true;
  });

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  // ========================================
  // RENDER
  // ========================================
  return (
    <Layout>
      <div className="p-6">
        <div className="space-y-6">
      {/* HEADER - Modernizado */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e02] via-[#2a4a04] to-[#4a7c0b]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                <span className="text-5xl">📦</span>
              </div>
              <div className="text-white">
                <h2 className="text-4xl font-black mb-2">Inventario de Productos</h2>
                <p className="text-white/90 text-lg font-semibold">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto registrado' : 'productos registrados'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`group relative px-6 py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2 border-2 ${
                  filtersOpen
                    ? 'bg-white text-[#2a4a04] border-white'
                    : 'bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 hover:border-white/50'
                }`}
              >
                <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCreateOpen(true)}
                className="group px-6 py-3 bg-white text-[#2a4a04] hover:text-[#1a2e02] rounded-xl transition-all font-black shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Agregar Producto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BÚSQUEDA - Modernizada */}
      <div className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 animate-fade-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#e8f0d8]/60 to-transparent rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] transition-all font-medium shadow-sm"
          />
        </div>
      </div>

      {/* PANEL DE FILTROS - Modernizado */}
      {filtersOpen && (
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-[#c0e09c] animate-fade-in">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a7c0b] via-[#6b7c45] to-[#4a7c0b]"></div>
          <div className="flex justify-between items-center mb-6 mt-2">
            <h3 className="font-black text-xl text-[#1a2e02] flex items-center gap-2">
              <Filter className="w-6 h-6" />
              Filtros Avanzados
            </h3>
            <button
              onClick={resetFilters}
              className="text-sm text-[#2a4a04] hover:text-[#1a2e02] font-black hover:bg-[#e8f0d8] px-4 py-2 rounded-lg transition-all"
            >
              Limpiar filtros ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-black text-[#1a2e02] mb-2">
                Categoría
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white shadow-sm"
              >
                <option value="">Todas</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-[#1a2e02] mb-2">
                Estado de Stock
              </label>
              <select
                value={filters.stockStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white shadow-sm"
              >
                <option value="">Todos</option>
                <option value="normal">Normal</option>
                <option value="low">Bajo</option>
                <option value="critical">Crítico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-[#1a2e02] mb-2">
                Proveedor
              </label>
              <select
                value={filters.supplierId}
                onChange={(e) => setFilters(prev => ({ ...prev, supplierId: e.target.value }))}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white shadow-sm"
              >
                <option value="">Todos</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-[#1a2e02] mb-2">
                Vencimiento
              </label>
              <select
                value={filters.expirationStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, expirationStatus: e.target.value }))}
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white shadow-sm"
              >
                <option value="">Todos</option>
                <option value="valid">Vigentes</option>
                <option value="expiring">Próximo a vencer</option>
                <option value="expired">Vencidos</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TABLA */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                    <p className="mt-2 text-gray-500">Cargando productos...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.currentStock, product.minStock);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            {product.location && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {product.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {product.currentStock} / {product.minStock} {product.unit}
                          </div>
                          <div className="text-xs text-gray-500">Actual / Mínimo</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.supplier?.name || '-'}</div>
                        {product.supplier?.city && (
                          <div className="text-xs text-gray-500">
                            {product.supplier.city.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${stockStatus.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                            ${stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${stockStatus.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {stockStatus.label}
                          </span>
                          {product.expirationDate && (
                            <div className="text-xs">
                              {isExpired(product.expirationDate) ? (
                                <span className="text-red-600 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Vencido
                                </span>
                              ) : isExpiringSoon(product.expirationDate) ? (
                                <span className="text-orange-600 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Por vencer
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setDetailsOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openEditDialog(product)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openOutputDialog(product)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Registrar salida"
                        >
                          <ArrowDownCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteConfirmOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR PRODUCTO */}
      {createOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Nuevo Producto</h2>
              <button
                onClick={() => {
                  setCreateOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Vitamina B12 o Helado de leche de cabra"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad de Medida <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: kg, litros, unidades"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor <span className="text-gray-500 text-xs">(Opcional para productos locales)</span>
                  </label>
                  <select
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">🌾 Producción Local / Sin proveedor</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Actual <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Mínimo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Bodega A, Estante 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLES */}
      {detailsOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Detalles del Producto</h2>
              <button
                onClick={() => {
                  setDetailsOpen(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Información General */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Información General
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-green-700 font-medium">Nombre:</span>
                    <p className="text-green-900">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Categoría:</span>
                    <p className="text-green-900">{selectedProduct.category}</p>
                  </div>
                  {selectedProduct.location && (
                    <div className="col-span-2">
                      <span className="text-green-700 font-medium">Ubicación:</span>
                      <p className="text-green-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedProduct.location}
                      </p>
                    </div>
                  )}
                  {selectedProduct.createdBy && (
                    <div className="col-span-2">
                      <span className="text-green-700 font-medium">Registrado por:</span>
                      <p className="text-green-900">👤 {selectedProduct.createdBy.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Stock
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Stock Actual:</span>
                    <p className="text-blue-900 text-lg font-bold">{selectedProduct.currentStock}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Stock Mínimo:</span>
                    <p className="text-blue-900 text-lg font-bold">{selectedProduct.minStock}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-blue-700 font-medium">Estado:</span>
                    <div className="mt-1">
                      {(() => {
                        const status = getStockStatus(selectedProduct.currentStock, selectedProduct.minStock);
                        return (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${status.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                            ${status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${status.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {status.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Precio y Vencimiento */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Precio y Vencimiento
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-purple-700 font-medium">Precio:</span>
                    <p className="text-purple-900 text-lg font-bold">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Fecha de Vencimiento:</span>
                    <p className="text-purple-900">{formatDate(selectedProduct.expirationDate)}</p>
                    {selectedProduct.expirationDate && (
                      <div className="mt-1">
                        {isExpired(selectedProduct.expirationDate) ? (
                          <span className="text-red-600 text-xs flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Vencido
                          </span>
                        ) : isExpiringSoon(selectedProduct.expirationDate) ? (
                          <span className="text-orange-600 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Próximo a vencer (30 días)
                          </span>
                        ) : (
                          <span className="text-green-600 text-xs">Vigente</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Proveedor */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Proveedor
                </h3>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-orange-700 font-medium">Nombre:</span>
                    <p className="text-orange-900">{selectedProduct.supplier?.name || '-'}</p>
                  </div>
                  {selectedProduct.supplier?.city && (
                    <div>
                      <span className="text-orange-700 font-medium">Ubicación:</span>
                      <p className="text-orange-900">
                        {selectedProduct.supplier.city.name}
                        {selectedProduct.supplier.city.state && `, ${selectedProduct.supplier.city.state.name}`}
                        {selectedProduct.supplier.city.state?.country && `, ${selectedProduct.supplier.city.state.country.name}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Salidas Recientes */}
              {selectedProduct.outputs && selectedProduct.outputs.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Últimas Salidas</h3>
                  <div className="space-y-2">
                    {selectedProduct.outputs.slice(0, 5).map((output) => (
                      <div key={output.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">Cantidad: {output.quantity}</p>
                          <p className="text-xs text-gray-500">{formatDate(output.date)}</p>
                          {output.notes && <p className="text-xs text-gray-600 mt-1">{output.notes}</p>}
                        </div>
                        <div className="text-xs text-gray-500">
                          {output.user?.name || 'Usuario'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    openEditDialog(selectedProduct);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Editar Producto</h2>
              <button
                onClick={() => {
                  setEditOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad de Medida <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: kg, litros, unidades"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor <span className="text-gray-500 text-xs">(Opcional para productos locales)</span>
                  </label>
                  <select
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">🌾 Producción Local / Sin proveedor</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Actual <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Mínimo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Actualizar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {deleteConfirmOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              ¿Eliminar Producto?
            </h2>
            <p className="text-center text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar <strong>{selectedProduct.name}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setSelectedProduct(null);
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR SALIDA */}
      {outputOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Registrar Salida</h2>
              <button
                onClick={() => {
                  setOutputOpen(false);
                  resetOutputForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleRegisterOutput} className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-900">
                  <strong>Producto:</strong> {selectedProduct.name}
                </p>
                <p className="text-sm text-blue-900">
                  <strong>Stock Actual:</strong> {selectedProduct.currentStock}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={outputFormData.quantity}
                  onChange={handleOutputInputChange}
                  required
                  min="1"
                  max={selectedProduct.currentStock}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Máximo disponible: {selectedProduct.currentStock}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  name="notes"
                  value={outputFormData.notes}
                  onChange={handleOutputInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Motivo de la salida, observaciones..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setOutputOpen(false);
                    resetOutputForm();
                  }}
                  disabled={registering}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {registering && <Loader2 className="w-4 h-4 animate-spin" />}
                  Registrar Salida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
    </Layout>
  );
}
