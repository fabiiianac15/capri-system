import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import {
  FileText,
  Package,
  Users,
  Building2,
  DollarSign,
  Loader2,
  FileSpreadsheet,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Product } from '../services/product.service';
import { productService } from '../services/product.service';
import type { Supplier } from '../services/supplier.service';
import { supplierService } from '../services/supplier.service';
import goatService from '../services/goat.service';
import type { Goat } from '../types';
import {
  PDFReportGenerator,
  ExcelReportGenerator,
  generateReport,
  type TableColumn
} from '../utils/reportGenerator';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B9D'];

// ========================================
// TIPOS
// ========================================
type ReportType = 'goats' | 'products' | 'suppliers' | 'general';

interface ReportSummary {
  totalGoats: number;
  totalProducts: number;
  totalSuppliers: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  activeGoats: number;
}

interface GoatStats {
  total: number;
  byCategory: Array<{ category: string; _count: number }>;
  byBreed: Array<{ breed: string; _count: number }>;
  bySex: Array<{ sex: string; _count: number }>;
  totalMilkProduction: number;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
export default function Reportes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'reportes';
  
  const [selectedReport, setSelectedReport] = useState<ReportType>('general');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Datos
  const [goats, setGoats] = useState<Goat[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<GoatStats | null>(null);
  const [summary, setSummary] = useState<ReportSummary>({
    totalGoats: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    lowStockProducts: 0,
    totalInventoryValue: 0,
    activeGoats: 0
  });

  // ========================================
  // EFECTOS
  // ========================================
  useEffect(() => {
    loadData();
  }, []);

  // ========================================
  // FUNCIONES DE CARGA
  // ========================================
  const loadData = async () => {
    try {
      setLoading(true);
      const [goatsData, productsData, suppliersData, statsData] = await Promise.all([
        goatService.getAll(),
        productService.getAll(),
        supplierService.getAll(),
        goatService.getStats()
      ]);

      setGoats(goatsData);
      setProducts(productsData);
      setSuppliers(suppliersData);
      setStats(statsData);

      // Calcular resumen
      const lowStock = productsData.filter((p: Product) => p.currentStock <= p.minStock);
      const inventoryValue = productsData.reduce((sum: number, p: Product) => sum + (p.price * p.currentStock), 0);
      const activeGoats = goatsData.filter((g: Goat) => g.status === 'ACTIVE');

      setSummary({
        totalGoats: goatsData.length,
        totalProducts: productsData.length,
        totalSuppliers: suppliersData.length,
        lowStockProducts: lowStock.length,
        totalInventoryValue: inventoryValue,
        activeGoats: activeGoats.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  // ========================================
  // FUNCIONES DE EXPORTACIÓN
  // ========================================
  const exportGoatsReport = async (format: 'pdf' | 'excel') => {
    setExporting(true);
    try {
      const columns: TableColumn[] = [
        { header: 'ID', dataKey: 'customId' },
        { header: 'Nombre', dataKey: 'name' },
        { header: 'Raza', dataKey: 'breed' },
        { header: 'Sexo', dataKey: 'sex' },
        { header: 'Categoría', dataKey: 'category' },
        { header: 'Peso (kg)', dataKey: 'weight' },
        { header: 'F. Nacimiento', dataKey: 'birthDate' },
        { header: 'Estado', dataKey: 'status' }
      ];

      const data = goats.map(goat => ({
        customId: goat.customId,
        name: goat.name || '-',
        breed: goat.breed,
        sex: goat.sex === 'MALE' ? 'Macho' : 'Hembra',
        category: goat.category,
        weight: goat.weight ? goat.weight.toFixed(2) : '-',
        birthDate: generateReport.formatDate(goat.birthDate),
        status: goat.status === 'ACTIVE' ? 'Activo' : goat.status === 'SOLD' ? 'Vendido' : 'Fallecido'
      }));

      if (format === 'pdf') {
        const pdf = new PDFReportGenerator({
          title: 'Reporte de Registro Caprino',
          orientation: 'landscape'
        });
        pdf.addHeader('Reporte de Registro Caprino', `Total de cabras: ${goats.length}`);
        pdf.addSummaryBox([
          { label: 'Total de cabras', value: summary.totalGoats },
          { label: 'Cabras activas', value: summary.activeGoats },
          { label: 'Razas diferentes', value: new Set(goats.map(g => g.breed)).size }
        ]);
        pdf.addTable(columns, data);
        pdf.download(`reporte-cabras-${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        const excel = new ExcelReportGenerator();
        excel.addSummarySheet('Resumen', [
          { label: 'Total de cabras', value: summary.totalGoats },
          { label: 'Cabras activas', value: summary.activeGoats },
          { label: 'Razas diferentes', value: new Set(goats.map(g => g.breed)).size }
        ]);
        excel.addSheet('Cabras', columns, data, 'Registro Caprino');
        excel.download(`reporte-cabras-${new Date().toISOString().split('T')[0]}.xlsx`);
      }

      alert(`Reporte de cabras exportado exitosamente en ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  const exportProductsReport = async (format: 'pdf' | 'excel') => {
    setExporting(true);
    try {
      const columns: TableColumn[] = [
        { header: 'Producto', dataKey: 'name' },
        { header: 'Categoría', dataKey: 'category' },
        { header: 'Stock Actual', dataKey: 'currentStock' },
        { header: 'Stock Mínimo', dataKey: 'minStock' },
        { header: 'Unidad', dataKey: 'unit' },
        { header: 'Precio', dataKey: 'price' },
        { header: 'Proveedor', dataKey: 'supplier' },
        { header: 'Estado', dataKey: 'status' }
      ];

      const data = products.map(product => ({
        name: product.name,
        category: product.category,
        currentStock: product.currentStock.toFixed(2),
        minStock: product.minStock.toFixed(2),
        unit: product.unit,
        price: generateReport.formatCurrency(product.price),
        supplier: product.supplier?.name || '-',
        status: product.currentStock <= product.minStock ? 'BAJO STOCK' : 'NORMAL'
      }));

      if (format === 'pdf') {
        const pdf = new PDFReportGenerator({
          title: 'Reporte de Inventario de Productos',
          orientation: 'landscape'
        });
        pdf.addHeader('Reporte de Inventario de Productos', `Total de productos: ${products.length}`);
        pdf.addSummaryBox([
          { label: 'Total de productos', value: summary.totalProducts },
          { label: 'Productos con stock bajo', value: summary.lowStockProducts },
          { label: 'Valor total inventario', value: generateReport.formatCurrency(summary.totalInventoryValue) }
        ]);
        pdf.addTable(columns, data);
        pdf.download(`reporte-productos-${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        const excel = new ExcelReportGenerator();
        excel.addSummarySheet('Resumen', [
          { label: 'Total de productos', value: summary.totalProducts },
          { label: 'Productos con stock bajo', value: summary.lowStockProducts },
          { label: 'Valor total inventario', value: summary.totalInventoryValue }
        ]);
        excel.addSheet('Productos', columns, data, 'Inventario de Productos');
        excel.download(`reporte-productos-${new Date().toISOString().split('T')[0]}.xlsx`);
      }

      alert(`Reporte de productos exportado exitosamente en ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  const exportSuppliersReport = async (format: 'pdf' | 'excel') => {
    setExporting(true);
    try {
      const columns: TableColumn[] = [
        { header: 'Empresa', dataKey: 'name' },
        { header: 'NIT', dataKey: 'nit' },
        { header: 'Teléfono', dataKey: 'phone' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Ciudad', dataKey: 'city' },
        { header: 'Departamento', dataKey: 'state' },
        { header: 'País', dataKey: 'country' }
      ];

      const data = suppliers.map(supplier => ({
        name: supplier.name,
        nit: supplier.nit || '-',
        phone: supplier.phone || '-',
        email: supplier.email || '-',
        city: supplier.city?.name || '-',
        state: supplier.city?.state?.name || '-',
        country: supplier.city?.state?.country?.name || '-'
      }));

      if (format === 'pdf') {
        const pdf = new PDFReportGenerator({
          title: 'Reporte de Proveedores',
          orientation: 'landscape'
        });
        pdf.addHeader('Reporte de Proveedores', `Total de proveedores: ${suppliers.length}`);
        pdf.addSummaryBox([
          { label: 'Total de proveedores', value: summary.totalSuppliers },
          { label: 'Ciudades diferentes', value: new Set(suppliers.map(s => s.city?.name).filter(Boolean)).size }
        ]);
        pdf.addTable(columns, data);
        pdf.download(`reporte-proveedores-${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        const excel = new ExcelReportGenerator();
        excel.addSummarySheet('Resumen', [
          { label: 'Total de proveedores', value: summary.totalSuppliers },
          { label: 'Ciudades diferentes', value: new Set(suppliers.map(s => s.city?.name).filter(Boolean)).size }
        ]);
        excel.addSheet('Proveedores', columns, data, 'Proveedores');
        excel.download(`reporte-proveedores-${new Date().toISOString().split('T')[0]}.xlsx`);
      }

      alert(`Reporte de proveedores exportado exitosamente en ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  const exportGeneralReport = async (format: 'pdf' | 'excel') => {
    setExporting(true);
    try {
      if (format === 'pdf') {
        const pdf = new PDFReportGenerator({
          title: 'Reporte General del Sistema',
          orientation: 'portrait'
        });
        
        pdf.addHeader('Reporte General del Sistema CAPRI', 'Resumen completo de la operación');
        
        pdf.addSummaryBox([
          { label: 'Total de Cabras', value: summary.totalGoats },
          { label: 'Cabras Activas', value: summary.activeGoats },
          { label: 'Total de Productos', value: summary.totalProducts },
          { label: 'Productos con Stock Bajo', value: summary.lowStockProducts },
          { label: 'Total de Proveedores', value: summary.totalSuppliers },
          { label: 'Valor Total Inventario', value: generateReport.formatCurrency(summary.totalInventoryValue) }
        ]);

        const goatsByCategory = goats.reduce((acc, goat) => {
          acc[goat.category] = (acc[goat.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const categoryData = Object.entries(goatsByCategory).map(([category, count]) => ({
          category,
          count: count.toString(),
          percentage: ((count / goats.length) * 100).toFixed(1) + '%'
        }));

        pdf.addTable(
          [
            { header: 'Categoría', dataKey: 'category' },
            { header: 'Cantidad', dataKey: 'count' },
            { header: 'Porcentaje', dataKey: 'percentage' }
          ],
          categoryData,
          'Distribución de Cabras por Categoría'
        );

        pdf.download(`reporte-general-${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        const excel = new ExcelReportGenerator();
        excel.addSummarySheet('Resumen General', [
          { label: 'Total de Cabras', value: summary.totalGoats },
          { label: 'Cabras Activas', value: summary.activeGoats },
          { label: 'Total de Productos', value: summary.totalProducts },
          { label: 'Productos con Stock Bajo', value: summary.lowStockProducts },
          { label: 'Total de Proveedores', value: summary.totalSuppliers },
          { label: 'Valor Total Inventario', value: summary.totalInventoryValue }
        ]);
        excel.download(`reporte-general-${new Date().toISOString().split('T')[0]}.xlsx`);
      }

      alert(`Reporte general exportado exitosamente en ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar el reporte');
    } finally {
      setExporting(false);
    }
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    switch (selectedReport) {
      case 'goats':
        exportGoatsReport(format);
        break;
      case 'products':
        exportProductsReport(format);
        break;
      case 'suppliers':
        exportSuppliersReport(format);
        break;
      case 'general':
        exportGeneralReport(format);
        break;
    }
  };

  // Preparar datos para gráficas
  const categoryData = stats?.byCategory.map(cat => ({
    name: cat.category,
    cantidad: cat._count,
  })) || [];

  const breedData = stats?.byBreed.map(breed => ({
    name: breed.breed,
    value: breed._count,
  })) || [];

  const sexData = stats?.bySex.map(sex => ({
    name: sex.sex === 'MALE' ? 'Machos' : 'Hembras',
    cantidad: sex._count,
  })) || [];

  // ========================================
  // RENDER
  // ========================================
  if (loading) {
    return (
      <Layout>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            <p className="text-xl font-medium text-gray-700">Cargando datos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
        <p className="text-gray-600 mt-1">Genera reportes y visualiza estadísticas del sistema</p>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-lg shadow-md p-2 flex gap-2">
        <button
          onClick={() => handleTabChange('reportes')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'reportes'
              ? 'bg-green-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Reportes
        </button>
        <button
          onClick={() => handleTabChange('statistics')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'statistics'
              ? 'bg-green-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Estadísticas
        </button>
        <button
          onClick={() => handleTabChange('charts')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'charts'
              ? 'bg-green-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <PieChartIcon className="w-4 h-4" />
          Gráficas
        </button>
      </div>

      {/* CONTENIDO - TAB REPORTES */}
      {activeTab === 'reportes' && (
        <div className="space-y-6">
          {/* RESUMEN GENERAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cabras</p>
                  <p className="text-3xl font-bold text-gray-900">{summary.totalGoats}</p>
                  <p className="text-xs text-green-600 mt-1">{summary.activeGoats} activas</p>
                </div>
                <Users className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Productos</p>
                  <p className="text-3xl font-bold text-gray-900">{summary.totalProducts}</p>
                  <p className="text-xs text-red-600 mt-1">{summary.lowStockProducts} bajo stock</p>
                </div>
                <Package className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Proveedores</p>
                  <p className="text-3xl font-bold text-gray-900">{summary.totalSuppliers}</p>
                </div>
                <Building2 className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600 md:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Total Inventario</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {generateReport.formatCurrency(summary.totalInventoryValue)}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* SELECTOR DE REPORTE */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seleccionar Tipo de Reporte</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setSelectedReport('general')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedReport === 'general'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <FileText className={`w-8 h-8 mx-auto mb-2 ${
                  selectedReport === 'general' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <p className="font-medium text-center">Reporte General</p>
                <p className="text-xs text-gray-500 text-center mt-1">Resumen completo</p>
              </button>

              <button
                onClick={() => setSelectedReport('goats')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedReport === 'goats'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <Users className={`w-8 h-8 mx-auto mb-2 ${
                  selectedReport === 'goats' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <p className="font-medium text-center">Registro Caprino</p>
                <p className="text-xs text-gray-500 text-center mt-1">{summary.totalGoats} cabras</p>
              </button>

              <button
                onClick={() => setSelectedReport('products')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedReport === 'products'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <Package className={`w-8 h-8 mx-auto mb-2 ${
                  selectedReport === 'products' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <p className="font-medium text-center">Inventario</p>
                <p className="text-xs text-gray-500 text-center mt-1">{summary.totalProducts} productos</p>
              </button>

              <button
                onClick={() => setSelectedReport('suppliers')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedReport === 'suppliers'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                  selectedReport === 'suppliers' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <p className="font-medium text-center">Proveedores</p>
                <p className="text-xs text-gray-500 text-center mt-1">{summary.totalSuppliers} registros</p>
              </button>
            </div>
          </div>

          {/* BOTONES DE EXPORTACIÓN */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Exportar Reporte</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleExport('pdf')}
                disabled={exporting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Exportar a PDF
                  </>
                )}
              </button>

              <button
                onClick={() => handleExport('excel')}
                disabled={exporting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-5 h-5" />
                    Exportar a Excel
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              El reporte seleccionado será descargado en el formato elegido
            </p>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              {selectedReport === 'general' && 'Reporte General del Sistema'}
              {selectedReport === 'goats' && 'Reporte de Registro Caprino'}
              {selectedReport === 'products' && 'Reporte de Inventario de Productos'}
              {selectedReport === 'suppliers' && 'Reporte de Proveedores'}
            </h3>
            <p className="text-sm text-blue-800">
              {selectedReport === 'general' && 'Incluye un resumen completo de cabras, productos, proveedores y estadísticas generales del sistema.'}
              {selectedReport === 'goats' && 'Listado completo de todas las cabras registradas con su información detallada.'}
              {selectedReport === 'products' && 'Detalle de todos los productos en inventario incluyendo stock y precios.'}
              {selectedReport === 'suppliers' && 'Información completa de todos los proveedores registrados.'}
            </p>
          </div>
        </div>
      )}

      {/* CONTENIDO - TAB ESTADÍSTICAS */}
      {activeTab === 'statistics' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-600">Total Cabras</p>
                <div className="bg-green-50 p-2 rounded-lg">
                  <span className="text-2xl">🐐</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats?.total || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Activas en el sistema</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-600">Producción</p>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <span className="text-2xl">🥛</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-blue-700">
                {stats?.totalMilkProduction.toFixed(1) || 0}L
              </p>
              <p className="text-xs text-gray-500 mt-2">Litros acumulados</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-600">Machos</p>
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <span className="text-2xl">♂️</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-indigo-700">
                {stats?.bySex.find(s => s.sex === 'MALE')?._count || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Reproductores</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-600">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-600">Hembras</p>
                <div className="bg-pink-50 p-2 rounded-lg">
                  <span className="text-2xl">♀️</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-pink-700">
                {stats?.bySex.find(s => s.sex === 'FEMALE')?._count || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Productoras</p>
            </div>
          </div>

          {/* Distribución por Categoría */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Distribución por Categoría</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats?.byCategory.map((cat) => (
                <div
                  key={cat.category}
                  className="text-center p-5 bg-green-50 rounded-lg border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all"
                >
                  <p className="text-xs font-bold text-gray-600 uppercase mb-2">{cat.category}</p>
                  <p className="text-3xl font-bold text-green-600">{cat._count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Distribución por Raza */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Distribución por Raza</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats?.byBreed.map((breed) => (
                <div
                  key={breed.breed}
                  className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <p className="text-sm font-bold text-gray-700 mb-3">{breed.breed}</p>
                  <p className="text-4xl font-bold text-blue-600">{breed._count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO - TAB GRÁFICAS */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* Gráfica de Barras - Por Categoría */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Distribución por Categoría</h3>
            <p className="text-sm text-gray-600 mb-6">Cantidad de caprinos por categoría productiva</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#888" style={{ fontSize: '12px' }} />
                <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E8E8E8',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="cantidad" fill="#22c55e" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grid 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfica Circular - Por Raza */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Distribución por Raza</h3>
              <p className="text-sm text-gray-600 mb-6">Proporción de caprinos por raza</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={breedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} (${entry.value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {breedData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfica de Barras - Por Sexo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Distribución por Sexo</h3>
              <p className="text-sm text-gray-600 mb-6">Comparación entre machos y hembras</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sexData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" stroke="#888" style={{ fontSize: '12px' }} />
                  <YAxis type="category" dataKey="name" stroke="#888" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E8E8E8',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#0088FE" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Producción de Leche */}
          {stats && stats.totalMilkProduction > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Producción de Leche Total</h3>
              <p className="text-sm text-gray-600 mb-6">Litros producidos acumulados</p>
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 mb-4">
                  <span className="text-5xl">🥛</span>
                </div>
                <p className="text-5xl font-bold text-blue-700 mb-2">
                  {stats.totalMilkProduction.toFixed(1)}L
                </p>
                <p className="text-gray-600">Total de litros producidos</p>
              </div>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </Layout>
  );
}
