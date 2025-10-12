import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { saleService, type Sale, type ProductType, type PaymentStatus } from '../services/sale.service';
import goatService from '../services/goat.service';
import type { Goat } from '../types';
import { useAuth } from '../context/AuthContext';
import { generateSalesReport } from '../utils/salesPdfReport';
import { 
  DollarSign,
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  X, 
  Loader2,
  Filter,
  User,
  ShoppingCart,
  FileText
} from 'lucide-react';

const PRODUCT_TYPES: ProductType[] = ['CARNE', 'LECHE', 'CABRA_VIVA'];
const PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'PARTIAL', 'PAID'];
const PAYMENT_METHODS = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'CHEQUE'];

export default function SalesPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [goats, setGoats] = useState<Goat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    productType: '',
    paymentStatus: '',
    startDate: '',
    endDate: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    productType: 'CARNE' as ProductType,
    quantity: '',
    unit: 'kg',
    unitPrice: '',
    totalPrice: '',
    paymentMethod: 'EFECTIVO',
    paymentStatus: 'PENDING' as PaymentStatus,
    goatId: '',
    notes: '',
    saleDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [salesData, goatsData, statsData] = await Promise.all([
        saleService.getAll({
          productType: filters.productType || undefined,
          paymentStatus: filters.paymentStatus || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined
        }),
        goatService.getAll({ status: 'ACTIVE' }),
        saleService.getStats()
      ]);
      setSales(salesData);
      setGoats(goatsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading sales:', error);
      alert('Error al cargar ventas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Auto-calculate total if not provided
      const total = formData.totalPrice 
        ? parseFloat(formData.totalPrice) 
        : parseFloat(formData.quantity) * parseFloat(formData.unitPrice);

      await saleService.create({
        customerName: formData.customerName,
        customerId: formData.customerId || undefined,
        productType: formData.productType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        unitPrice: parseFloat(formData.unitPrice),
        totalPrice: total,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        goatId: formData.productType === 'CABRA_VIVA' ? formData.goatId : undefined,
        notes: formData.notes || undefined,
        saleDate: formData.saleDate
      });
      
      alert('Venta creada exitosamente');
      setCreateOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSale) return;

    try {
      setIsSubmitting(true);

      // Auto-calculate total if not provided
      const total = formData.totalPrice 
        ? parseFloat(formData.totalPrice) 
        : parseFloat(formData.quantity) * parseFloat(formData.unitPrice);

      await saleService.update(selectedSale.id, {
        customerName: formData.customerName,
        customerId: formData.customerId || undefined,
        productType: formData.productType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        unitPrice: parseFloat(formData.unitPrice),
        totalPrice: total,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        goatId: formData.productType === 'CABRA_VIVA' ? formData.goatId : undefined,
        notes: formData.notes || undefined,
        saleDate: formData.saleDate
      });
      
      alert('Venta actualizada exitosamente');
      setEditOpen(false);
      setSelectedSale(null);
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al actualizar venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSale) return;

    try {
      setIsSubmitting(true);
      await saleService.delete(selectedSale.id);
      
      alert('Venta eliminada exitosamente');
      setDeleteConfirmOpen(false);
      setSelectedSale(null);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al eliminar venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (sale: Sale) => {
    setSelectedSale(sale);
    setFormData({
      customerName: sale.customerName,
      customerId: sale.customerId || '',
      productType: sale.productType,
      quantity: sale.quantity.toString(),
      unit: sale.unit,
      unitPrice: sale.unitPrice.toString(),
      totalPrice: sale.totalPrice.toString(),
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus,
      goatId: sale.goatId || '',
      notes: sale.notes || '',
      saleDate: new Date(sale.saleDate).toISOString().split('T')[0]
    });
    setEditOpen(true);
  };

  const openDetailsModal = (sale: Sale) => {
    setSelectedSale(sale);
    setDetailsOpen(true);
  };

  const openDeleteModal = (sale: Sale) => {
    setSelectedSale(sale);
    setDeleteConfirmOpen(true);
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerId: '',
      productType: 'CARNE',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      totalPrice: '',
      paymentMethod: 'EFECTIVO',
      paymentStatus: 'PENDING',
      goatId: '',
      notes: '',
      saleDate: new Date().toISOString().split('T')[0]
    });
  };

  const filteredSales = sales.filter(s =>
    s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.customerId && s.customerId.includes(searchTerm))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusLabel = (status: PaymentStatus) => {
    const labels: Record<PaymentStatus, string> = {
      PAID: 'Pagado',
      PARTIAL: 'Parcial',
      PENDING: 'Pendiente'
    };
    return labels[status];
  };

  const getProductTypeLabel = (type: ProductType) => {
    const labels: Record<ProductType, string> = {
      CARNE: 'Carne',
      LECHE: 'Leche',
      CABRA_VIVA: 'Cabra Viva'
    };
    return labels[type];
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            <p className="text-xl font-medium text-gray-700">Cargando ventas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="space-y-6">
          {/* HEADER - Modernizado */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e02] via-[#2a4a04] to-[#4a7c0b]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                    <span className="text-5xl">💰</span>
                  </div>
                  <div className="text-white">
                    <h2 className="text-4xl font-black mb-2">Gestión de Ventas</h2>
                    <p className="text-white/90 text-lg font-semibold">Registra y administra las ventas de productos caprinos</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => generateSalesReport(filteredSales, user?.name || 'Usuario')}
                    className="group px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2 border-2 border-white/30 hover:border-white/50"
                  >
                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Exportar PDF
                  </button>
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="group px-6 py-3 bg-white text-[#2a4a04] hover:text-[#1a2e02] rounded-xl transition-all font-black shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Nueva Venta
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH AND FILTERS */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 font-medium ${
                  filtersOpen
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-500'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filtros
                {(filters.productType || filters.paymentStatus || filters.startDate || filters.endDate) && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {[filters.productType, filters.paymentStatus, filters.startDate, filters.endDate].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {filtersOpen && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Producto
                  </label>
                  <select
                    value={filters.productType}
                    onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="CARNE">Carne</option>
                    <option value="LECHE">Leche</option>
                    <option value="CABRA_VIVA">Cabra Viva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de Pago
                  </label>
                  <select
                    value={filters.paymentStatus}
                    onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="PARTIAL">Parcial</option>
                    <option value="PAID">Pagado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end md:col-span-4">
                  <button
                    onClick={() => setFilters({ productType: '', paymentStatus: '', startDate: '', endDate: '' })}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STATS - Modernizado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {/* Total Ventas */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-green-200 hover:border-green-400 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                    <ShoppingCart className="w-7 h-7 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-8 h-8 text-green-600 opacity-40" />
                  </div>
                </div>
                <p className="text-sm font-black text-gray-600 mb-1">TOTAL VENTAS</p>
                <p className="text-5xl font-black text-gray-900 mb-2">{stats.totalSales}</p>
                <p className="text-xs font-bold text-green-600">Ventas registradas</p>
              </div>
            </div>

            {/* Ingresos Totales */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-blue-200 hover:border-blue-400 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="w-8 h-8 text-blue-600 opacity-40" />
                  </div>
                </div>
                <p className="text-sm font-black text-gray-600 mb-1">INGRESOS TOTALES</p>
                <p className="text-4xl font-black text-gray-900 mb-2">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs font-bold text-blue-600">Total recaudado</p>
              </div>
            </div>

            {/* Pagos Pendientes */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-red-200 hover:border-red-400 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-100 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-8 h-8 text-red-600 opacity-40" />
                  </div>
                </div>
                <p className="text-sm font-black text-gray-600 mb-1">PAGOS PENDIENTES</p>
                <p className="text-4xl font-black text-gray-900 mb-2">{formatCurrency(stats.pendingPayments)}</p>
                <p className="text-xs font-bold text-red-600">Por cobrar</p>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
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
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No hay ventas registradas</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(sale.saleDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {sale.customerName}
                            </div>
                            {sale.customerId && (
                              <div className="text-xs text-gray-500">{sale.customerId}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            sale.productType === 'CARNE'
                              ? 'bg-red-100 text-red-800'
                              : sale.productType === 'LECHE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {getProductTypeLabel(sale.productType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.quantity} {sale.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          {formatCurrency(sale.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(sale.paymentStatus)}`}>
                            {getPaymentStatusLabel(sale.paymentStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openDetailsModal(sale)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Ver detalles"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openEditModal(sale)}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                              title="Editar"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(sale)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODAL CREATE */}
          {createOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Nueva Venta</h2>
                  <button
                    onClick={() => { setCreateOpen(false); resetForm(); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Cliente *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Customer ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID/DNI del Cliente
                      </label>
                      <input
                        type="text"
                        value={formData.customerId}
                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Producto *
                      </label>
                      <select
                        required
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value as ProductType, goatId: '' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {PRODUCT_TYPES.map(type => (
                          <option key={type} value={type}>{getProductTypeLabel(type)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Goat Selection (only for CABRA_VIVA) */}
                    {formData.productType === 'CABRA_VIVA' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cabra *
                        </label>
                        <select
                          required={formData.productType === 'CABRA_VIVA'}
                          value={formData.goatId}
                          onChange={(e) => setFormData({ ...formData, goatId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar cabra...</option>
                          {goats.map(goat => (
                            <option key={goat.id} value={goat.id}>
                              {goat.customId} - {goat.name || 'Sin nombre'} ({goat.breed})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Sale Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Venta *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.saleDate}
                        onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          placeholder="Unidad"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio Unitario (COP) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="100"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Total Price (optional, auto-calculated) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio Total (COP)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={formData.totalPrice}
                        onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                        placeholder="Se calcula automáticamente"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Pago *
                      </label>
                      <select
                        required
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {PAYMENT_METHODS.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado de Pago *
                      </label>
                      <select
                        required
                        value={formData.paymentStatus}
                        onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {PAYMENT_STATUSES.map(status => (
                          <option key={status} value={status}>{getPaymentStatusLabel(status)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => { setCreateOpen(false); resetForm(); }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        'Crear Venta'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL EDIT - Similar to CREATE but with existing data */}
          {editOpen && selectedSale && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Editar Venta</h2>
                  <button
                    onClick={() => { setEditOpen(false); setSelectedSale(null); resetForm(); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Same fields as CREATE */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Cliente *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID/DNI del Cliente
                      </label>
                      <input
                        type="text"
                        value={formData.customerId}
                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Producto *
                      </label>
                      <select
                        required
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value as ProductType, goatId: '' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {PRODUCT_TYPES.map(type => (
                          <option key={type} value={type}>{getProductTypeLabel(type)}</option>
                        ))}
                      </select>
                    </div>

                    {formData.productType === 'CABRA_VIVA' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cabra *
                        </label>
                        <select
                          required={formData.productType === 'CABRA_VIVA'}
                          value={formData.goatId}
                          onChange={(e) => setFormData({ ...formData, goatId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar cabra...</option>
                          {goats.map(goat => (
                            <option key={goat.id} value={goat.id}>
                              {goat.customId} - {goat.name || 'Sin nombre'} ({goat.breed})
                            </option>
                          ))}
                          {/* Also show currently selected goat if sold */}
                          {selectedSale.goat && !goats.find(g => g.id === selectedSale.goat?.id) && (
                            <option value={selectedSale.goat.id}>
                              {selectedSale.goat.customId} - {selectedSale.goat.name || 'Sin nombre'} (VENDIDA)
                            </option>
                          )}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Venta *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.saleDate}
                        onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          placeholder="Unidad"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio Unitario (COP) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="100"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio Total (COP)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={formData.totalPrice}
                        onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                        placeholder="Se calcula automáticamente"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Pago *
                      </label>
                      <select
                        required
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {PAYMENT_METHODS.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado de Pago *
                      </label>
                      <select
                        required
                        value={formData.paymentStatus}
                        onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {PAYMENT_STATUSES.map(status => (
                          <option key={status} value={status}>{getPaymentStatusLabel(status)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => { setEditOpen(false); setSelectedSale(null); resetForm(); }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        'Actualizar'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL DETAILS */}
          {detailsOpen && selectedSale && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Detalles de la Venta</h2>
                  <button
                    onClick={() => { setDetailsOpen(false); setSelectedSale(null); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Información del Cliente */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      Información del Cliente
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Nombre</p>
                        <p className="font-medium text-gray-900">{selectedSale.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ID/DNI</p>
                        <p className="font-medium text-gray-900">{selectedSale.customerId || 'No especificado'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información del Producto */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-green-600" />
                      Información del Producto
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedSale.productType === 'CARNE'
                            ? 'bg-red-100 text-red-800'
                            : selectedSale.productType === 'LECHE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {getProductTypeLabel(selectedSale.productType)}
                        </span>
                      </div>
                      {selectedSale.goat && (
                        <div>
                          <p className="text-sm text-gray-600">Cabra</p>
                          <p className="font-medium text-gray-900">
                            {selectedSale.goat.customId} - {selectedSale.goat.name || 'Sin nombre'}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Cantidad</p>
                        <p className="font-medium text-gray-900">{selectedSale.quantity} {selectedSale.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Precio Unitario</p>
                        <p className="font-medium text-gray-900">{formatCurrency(selectedSale.unitPrice)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información de Pago */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Información de Pago
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-bold text-lg text-green-600">{formatCurrency(selectedSale.totalPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estado</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedSale.paymentStatus)}`}>
                          {getPaymentStatusLabel(selectedSale.paymentStatus)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Método de Pago</p>
                        <p className="font-medium text-gray-900">{selectedSale.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Venta</p>
                        <p className="font-medium text-gray-900">{formatDate(selectedSale.saleDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  {selectedSale.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Notas</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{selectedSale.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* User Info */}
                  {selectedSale.user && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Registrado por
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900">{selectedSale.user.name}</p>
                        <p className="text-sm text-gray-600">{selectedSale.user.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                  <button
                    onClick={() => { setDetailsOpen(false); setSelectedSale(null); }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL DELETE */}
          {deleteConfirmOpen && selectedSale && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    ¿Eliminar Venta?
                  </h3>
                  <p className="text-gray-600 text-center mb-2">
                    ¿Estás seguro de que deseas eliminar la venta de <strong>{selectedSale.customerName}</strong>?
                  </p>
                  <p className="text-gray-600 text-center mb-6">
                    Total: <strong>{formatCurrency(selectedSale.totalPrice)}</strong>
                  </p>
                  {selectedSale.productType === 'CABRA_VIVA' && (
                    <p className="text-yellow-600 text-sm text-center mb-4">
                      ⚠️ La cabra volverá a estar ACTIVA en el inventario
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setDeleteConfirmOpen(false); setSelectedSale(null); }}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        'Eliminar'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
