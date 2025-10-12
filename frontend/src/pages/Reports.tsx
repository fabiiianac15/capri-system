import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { CategoryChart, BreedPieChart, SexChart } from '../components/Charts';
import { generateDashboardReport } from '../utils/pdfReport';
import { generateGoatsReport } from '../utils/goatsPdfReport';
import { generateSalesReport } from '../utils/salesPdfReport';
import goatService from '../services/goat.service';
import { saleService } from '../services/sale.service';
import type { GoatStats } from '../types/index';
import type { Goat } from '../types/index';
import type { Sale } from '../services/sale.service';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  Loader2,
  DollarSign,
  Package,
  Milk,
  Activity,
  LineChart,
  Target
} from 'lucide-react';

export default function ReportsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState<GoatStats | null>(null);
  const [goats, setGoats] = useState<Goat[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determinar qué tab mostrar basado en el query parameter
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'statistics'; // 'statistics' o 'charts'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, goatsData, salesData] = await Promise.all([
        goatService.getStats(),
        goatService.getAll(),
        saleService.getAll()
      ]);
      setStats(statsData);
      setGoats(goatsData);
      setSales(salesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!stats || !user) return;
    generateDashboardReport(stats, user.name);
  };

  const handleGenerateGoatsReport = () => {
    if (!goats.length || !user) return;
    generateGoatsReport(goats, user.name);
  };

  const handleGenerateSalesReport = () => {
    if (!sales.length || !user) return;
    generateSalesReport(sales, user.name);
  };

  // Calcular estadísticas de ventas
  const salesStats = {
    total: sales.length,
    totalRevenue: sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    paidSales: sales.filter(s => s.paymentStatus === 'PAID').length,
    pendingSales: sales.filter(s => s.paymentStatus === 'PENDING').length,
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            <p className="text-xl font-medium text-gray-700">Cargando reportes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Vista de ESTADÍSTICAS (números, métricas, tablas)
  if (activeTab === 'statistics') {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header - Modernizado para consistencia */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
              
              <div className="relative p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-black text-white mb-2">
                        Estadísticas del Sistema
                      </h1>
                      <p className="text-white/90 text-lg font-semibold">
                        Métricas y análisis numérico de tu granja caprino
                      </p>
                      <div className="flex items-center gap-2 text-sm text-white/80 mt-2 font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date().toLocaleDateString('es-CO', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Cards - Tarjetas para generar diferentes reportes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dashboard Report */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Reporte General</h3>
                    <p className="text-sm text-gray-600">Vista completa del sistema</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Cabras:</span>
                    <span className="font-bold text-green-600">{stats?.total || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Producción:</span>
                    <span className="font-bold text-green-600">{stats?.totalMilkProduction.toFixed(1) || 0}L</span>
                  </div>
                </div>
                <button
                  onClick={handleGenerateReport}
                  disabled={!stats}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Generar PDF
                </button>
              </div>

              {/* Goats Report */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <span className="text-3xl">🐐</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Reporte de Cabras</h3>
                    <p className="text-sm text-gray-600">Inventario detallado</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Registradas:</span>
                    <span className="font-bold text-purple-600">{goats.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Razas Diferentes:</span>
                    <span className="font-bold text-purple-600">{stats?.byBreed.length || 0}</span>
                  </div>
                </div>
                <button
                  onClick={handleGenerateGoatsReport}
                  disabled={goats.length === 0}
                  className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Generar PDF
                </button>
              </div>

              {/* Sales Report */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Reporte de Ventas</h3>
                    <p className="text-sm text-gray-600">Análisis financiero</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Ventas:</span>
                    <span className="font-bold text-blue-600">{salesStats.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ingresos:</span>
                    <span className="font-bold text-blue-600">${salesStats.totalRevenue.toLocaleString('es-CO')}</span>
                  </div>
                </div>
                <button
                  onClick={handleGenerateSalesReport}
                  disabled={sales.length === 0}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Generar PDF
                </button>
              </div>
            </div>

            {/* Tablas Detalladas - Solo en estadísticas */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Details */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Detalles por Categoría
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-purple-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-purple-700 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-purple-700 uppercase tracking-wider">
                            Porcentaje
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.byCategory.map((cat) => {
                          const percentage = stats.total > 0 ? ((cat._count / stats.total) * 100).toFixed(1) : '0';
                          return (
                            <tr key={cat.category} className="hover:bg-purple-50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cat.category}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-purple-100 text-purple-700">
                                  {cat._count}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Breed Details */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-teal-600" />
                    Detalles por Raza
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-teal-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                            Raza
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-teal-700 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-teal-700 uppercase tracking-wider">
                            Porcentaje
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.byBreed.map((breed) => {
                          const percentage = stats.total > 0 ? ((breed._count / stats.total) * 100).toFixed(1) : '0';
                          return (
                            <tr key={breed.breed} className="hover:bg-teal-50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {breed.breed}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-teal-100 text-teal-700">
                                  {breed._count}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Production Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl shadow-lg p-6 border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Milk className="w-6 h-6 text-blue-600" />
                Análisis de Producción
              </h2>

              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Production */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Milk className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700">Producción Total</h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalMilkProduction.toFixed(1)} L</p>
                    <p className="text-xs text-gray-500 mt-1">Litros acumulados</p>
                  </div>

                  {/* Average per Goat */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700">Promedio General</h4>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.total > 0 ? (stats.totalMilkProduction / stats.total).toFixed(2) : '0.00'} L
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Por cabra</p>
                  </div>

                  {/* Female Production */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-pink-100 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-pink-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700">Promedio Hembras</h4>
                    </div>
                    <p className="text-3xl font-bold text-pink-600">
                      {stats.bySex.find(s => s.sex === 'FEMALE')?._count 
                        ? (stats.totalMilkProduction / (stats.bySex.find(s => s.sex === 'FEMALE')?._count || 1)).toFixed(2)
                        : '0.00'} L
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Por hembra productora</p>
                  </div>

                  {/* Productive Females */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700">Hembras Activas</h4>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.bySex.find(s => s.sex === 'FEMALE')?._count || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hembras en el rebaño</p>
                  </div>
                </div>
              )}
            </div>

            {/* Info Footer */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">📊 Vista de Estadísticas</h4>
                  <p className="text-sm text-gray-700">
                    Esta sección se enfoca en <strong>datos numéricos y métricas</strong>. Aquí puedes generar reportes en PDF 
                    con información detallada, ver tablas comparativas por categoría y raza, y analizar métricas de producción.
                    Para ver <strong>gráficas visuales interactivas</strong>, dirígete a la sección de "Gráficas" en el menú.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Vista de GRÁFICAS (visualización interactiva)
  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header - Modernizado para consistencia */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
            
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                    <LineChart className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                      Gráficas Interactivas
                    </h1>
                    <p className="text-white/90 text-lg font-semibold">
                      Visualiza tus datos con gráficas dinámicas y coloridas
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/80 mt-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date().toLocaleDateString('es-CO', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleGenerateReport}
                  disabled={!stats}
                  className="group bg-white text-blue-700 px-6 py-3 rounded-xl font-black hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 hover:scale-105"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Descargar PDF General
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Cabras</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-2xl">🐐</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Producción</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalMilkProduction.toFixed(1) || 0}L</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Categorías</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.byCategory.length || 0}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Razas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.byBreed.length || 0}</p>
                </div>
                <div className="bg-teal-100 p-3 rounded-lg">
                  <PieChartIcon className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid - Gráficas grandes */}
          {stats && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                      Distribución por Categoría
                    </h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-bold">
                      {stats.byCategory.length} categorías
                    </span>
                  </div>
                  <div className="h-80">
                    <CategoryChart stats={stats} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Gráfico de barras vertical mostrando la cantidad de cabras por categoría productiva.
                    </p>
                  </div>
                </div>

                {/* Breed Pie Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-teal-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <PieChartIcon className="w-6 h-6 text-teal-600" />
                      Distribución por Raza
                    </h3>
                    <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full font-bold">
                      {stats.byBreed.length} razas
                    </span>
                  </div>
                  <div className="h-80">
                    <BreedPieChart stats={stats} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Gráfico circular que representa la proporción de cada raza en tu rebaño.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sex Chart - Full Width */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                    Distribución por Sexo
                  </h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-bold">
                    Comparación M/F
                  </span>
                </div>
                <div className="h-80">
                  <SexChart stats={stats} />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Machos</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {stats.bySex.find(s => s.sex === 'MALE')?._count || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.total > 0 
                        ? ((((stats.bySex.find(s => s.sex === 'MALE')?._count || 0) / stats.total) * 100).toFixed(1))
                        : '0'}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Hembras</p>
                    <p className="text-3xl font-bold text-pink-600">
                      {stats.bySex.find(s => s.sex === 'FEMALE')?._count || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.total > 0 
                        ? ((((stats.bySex.find(s => s.sex === 'FEMALE')?._count || 0) / stats.total) * 100).toFixed(1))
                        : '0'}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumen Visual con Cards */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  Resumen Visual del Rebaño
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Por Categoría */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">Top Categorías</h4>
                    <div className="space-y-2">
                      {stats.byCategory.slice(0, 3).map((cat, index) => {
                        const percentage = stats.total > 0 ? ((cat._count / stats.total) * 100).toFixed(0) : '0';
                        const colors = ['bg-purple-500', 'bg-purple-400', 'bg-purple-300'];
                        return (
                          <div key={cat.category} className="flex items-center gap-2">
                            <div className={`w-8 h-8 ${colors[index]} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-700">{cat.category}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 ${colors[index]} rounded-full`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-gray-600">{cat._count}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Por Raza */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">Top Razas</h4>
                    <div className="space-y-2">
                      {stats.byBreed.slice(0, 3).map((breed, index) => {
                        const percentage = stats.total > 0 ? ((breed._count / stats.total) * 100).toFixed(0) : '0';
                        const colors = ['bg-teal-500', 'bg-teal-400', 'bg-teal-300'];
                        return (
                          <div key={breed.breed} className="flex items-center gap-2">
                            <div className={`w-8 h-8 ${colors[index]} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-700">{breed.breed}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 ${colors[index]} rounded-full`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-gray-600">{breed._count}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Indicadores Clave */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">Indicadores Clave</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ratio M/F</span>
                        <span className="font-bold text-indigo-600">
                          {stats.bySex.find(s => s.sex === 'MALE')?._count || 0}:
                          {stats.bySex.find(s => s.sex === 'FEMALE')?._count || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Prod. Promedio</span>
                        <span className="font-bold text-blue-600">
                          {stats.total > 0 ? (stats.totalMilkProduction / stats.total).toFixed(1) : '0'} L
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Diversidad</span>
                        <span className="font-bold text-green-600">
                          {stats.byBreed.length} {stats.byBreed.length === 1 ? 'raza' : 'razas'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Productoras</span>
                        <span className="font-bold text-pink-600">
                          {stats.bySex.find(s => s.sex === 'FEMALE')?._count || 0} hembras
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Info Footer */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <LineChart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-900 mb-2">📈 Vista de Gráficas Interactivas</h4>
                <p className="text-sm text-gray-700">
                  Esta sección se enfoca en <strong>visualización gráfica e interactiva</strong> de tus datos. 
                  Las gráficas son dinámicas y responden al movimiento del mouse mostrando detalles adicionales.
                  Para ver <strong>tablas detalladas y métricas numéricas</strong>, dirígete a la sección de "Estadísticas" en el menú.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
