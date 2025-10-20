import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import goatService from '../services/goat.service';
import { generateDashboardReport } from '../utils/pdfReport';
import type { GoatStats } from '../types/index';
import { 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  Activity,
  Users,
  ShoppingCart,
  Package,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Droplet,
  Heart,
  FileText,
  Download
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<GoatStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadStats();
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const loadStats = async () => {
    try {
      const data = await goatService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!stats || !user) return;
    generateDashboardReport(stats, user.name);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="h-12 w-12 animate-spin text-[#6b7c45]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-medium text-[#6b7c45]">Cargando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner with Clock */}
          <div className="mb-8 relative overflow-hidden rounded-2xl shadow-2xl animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a4a04] via-[#4a7c0b] to-[#6b7c45]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                      <span className="text-4xl">🐐</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold text-white mb-1 flex items-center gap-3">
                        ¡Hola, {user?.name || 'Administrador'}!
                        <span className="animate-wave inline-block text-3xl">👋</span>
                      </h2>
                      <p className="text-white/90 text-lg font-semibold">
                        Sistema de Gestión Caprina Granme
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 mt-4 w-fit">
                    <span className="flex items-center gap-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      {currentTime.toLocaleDateString('es-CO', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div className="w-px h-4 bg-white/30"></div>
                    <span className="flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4" />
                      {currentTime.toLocaleTimeString('es-CO')}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 border border-white/30 shadow-lg">
                    <p className="text-xs text-white/80 uppercase tracking-wider font-bold mb-1">Tu Rol</p>
                    <p className="text-xl font-extrabold text-white">
                      {user?.role === 'COORDINADOR' ? '👑 Coordinador' : user?.role === 'EMPLEADO' ? '👤 Empleado' : '🎓 Pasante'}
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateReport}
                    className="group relative bg-white text-[#2a4a04] px-6 py-3 rounded-xl font-bold hover:bg-white/95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e8f0d8] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FileText className="w-5 h-5 relative z-10" />
                    <Download className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Generar Reporte PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Total Cabras */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-2 border-transparent hover:border-[#4a7c0b]/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4a7c0b]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-[#4a7c0b] to-[#6b7c45] p-4 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl filter drop-shadow-md">🐐</span>
                  </div>
                  <div className="bg-[#e8f0d8] p-2 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-[#4a7c0b]" />
                  </div>
                </div>
                <p className="text-xs font-extrabold text-[#6b7c45] uppercase tracking-wider mb-2">Total Cabras</p>
                <p className="text-5xl font-black text-[#1a2e02] mb-3">
                  {stats?.total || 0}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-[#e8f0d8] px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-[#4a7c0b] rounded-full animate-pulse"></div>
                    <span className="font-bold text-[#2a4a04]">Sistema Activo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Producción */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-2 border-transparent hover:border-blue-400/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Droplet className="w-8 h-8 text-white filter drop-shadow-md" />
                  </div>
                  <div className="bg-blue-50 p-2 rounded-xl">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-2">Producción Total</p>
                <p className="text-5xl font-black text-gray-900 mb-3">
                  {stats?.totalMilkProduction.toFixed(1) || 0}<span className="text-2xl text-gray-500 ml-1">L</span>
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
                    <TrendingUp className="w-3 h-3 text-blue-600" />
                    <span className="font-bold text-blue-700">Litros Acumulados</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Machos */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-2 border-transparent hover:border-indigo-400/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl filter drop-shadow-md">♂️</span>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded-xl">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <p className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-2">Machos</p>
                <p className="text-5xl font-black text-gray-900 mb-3">
                  {stats?.bySex.find(s => s.sex === 'MALE')?._count || 0}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-full">
                    <Heart className="w-3 h-3 text-indigo-600" />
                    <span className="font-bold text-indigo-700">Reproductores</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Hembras */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in border-2 border-transparent hover:border-pink-400/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl filter drop-shadow-md">♀️</span>
                  </div>
                  <div className="bg-pink-50 p-2 rounded-xl">
                    <Award className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
                <p className="text-xs font-extrabold text-pink-600 uppercase tracking-wider mb-2">Hembras</p>
                <p className="text-5xl font-black text-gray-900 mb-3">
                  {stats?.bySex.find(s => s.sex === 'FEMALE')?._count || 0}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-pink-50 px-3 py-1.5 rounded-full">
                    <Droplet className="w-3 h-3 text-pink-600" />
                    <span className="font-bold text-pink-700">Productoras</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts/Notifications Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Alert Card 1 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 via-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative flex items-start gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 mb-2 text-lg">Recordatorio</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Próximas vacunaciones programadas para esta semana</p>
                  <button className="mt-4 text-xs font-black text-yellow-700 hover:text-yellow-800 flex items-center gap-1 bg-yellow-100 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-colors">
                    Ver detalles →
                  </button>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 mb-2 text-lg">Inventario</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Stock de alimentos y suministros al 85%</p>
                  <button className="mt-4 text-xs font-black text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-blue-100 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                    Revisar inventario →
                  </button>
                </div>
              </div>
            </div>

            {/* Sales Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 mb-2 text-lg">Ventas del Mes</h4>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Se han registrado 0 ventas este mes</p>
                  <button className="mt-4 text-xs font-black text-green-700 hover:text-green-800 flex items-center gap-1 bg-green-100 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    Ver ventas →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Por Categoría */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-7 animate-fade-in border-2 border-gray-100">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-20 -mt-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-md">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <span>Por Categoría</span>
                  </h3>
                  <span className="bg-purple-100 text-purple-700 text-sm font-bold px-4 py-2 rounded-full">{stats?.byCategory.length || 0} categorías</span>
                </div>
                
                <div className="space-y-4">
                  {stats?.byCategory.map((cat, index) => {
                    const percentage = stats.total > 0 ? (cat._count / stats.total * 100).toFixed(1) : 0;
                    const colors = [
                      { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' },
                      { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
                      { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' },
                      { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-700' },
                      { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700' }
                    ];
                    const color = colors[index % colors.length];
                    
                    return (
                      <div key={cat.category} className="group hover:scale-[1.02] transition-transform duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-black text-gray-800">{cat.category}</span>
                          <div className="flex items-center gap-2">
                            <span className={`${color.light} ${color.text} text-xs font-bold px-3 py-1 rounded-full`}>{percentage}%</span>
                            <span className="text-sm font-black text-gray-900">{cat._count}</span>
                          </div>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className={`h-full ${color.bg} transition-all duration-700 group-hover:opacity-90 shadow-md`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Por Raza */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-7 animate-fade-in border-2 border-gray-100">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-100 to-transparent rounded-full -mr-20 -mt-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-xl shadow-md">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span>Por Raza</span>
                  </h3>
                  <span className="bg-teal-100 text-teal-700 text-sm font-bold px-4 py-2 rounded-full">{stats?.byBreed.length || 0} razas</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {stats?.byBreed.map((breed, index) => {
                    const emojis = ['🧬', '🌟', '⭐', '✨', '💫', '🎯'];
                    const gradients = [
                      'from-teal-500 to-cyan-500',
                      'from-blue-500 to-indigo-500',
                      'from-purple-500 to-pink-500',
                      'from-orange-500 to-red-500',
                    ];
                    
                    return (
                      <div 
                        key={breed.breed} 
                        className={`group relative overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-white/20`}
                      >
                        <div className="absolute top-0 right-0 text-6xl opacity-10">
                          {emojis[index % emojis.length]}
                        </div>
                        <p className="text-sm font-extrabold mb-2 relative z-10 uppercase tracking-wide">{breed.breed}</p>
                        <p className="text-5xl font-black relative z-10 mb-1">{breed._count}</p>
                        <p className="text-xs font-bold mt-2 opacity-90 relative z-10 bg-white/20 px-2 py-1 rounded-full w-fit">
                          {stats.total > 0 ? ((breed._count / stats.total) * 100).toFixed(1) : 0}% del total
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-7 animate-fade-in border-2 border-gray-100">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-20 -mt-20"></div>
            <div className="relative">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-md">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span>Acciones Rápidas</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <button className="group relative overflow-hidden p-6 bg-gradient-to-br from-[#e8f0d8] to-[#d3dbb8] hover:from-[#d3dbb8] hover:to-[#c0e09c] rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-[#c0e09c]">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#4a7c0b]/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🐐</div>
                    <p className="text-sm font-black text-[#1a2e02]">Registrar Cabra</p>
                  </div>
                </button>
                
                <button className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-blue-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💉</div>
                    <p className="text-sm font-black text-blue-900">Control Sanitario</p>
                  </div>
                </button>
                
                <button className="group relative overflow-hidden p-6 bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-purple-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📦</div>
                    <p className="text-sm font-black text-purple-900">Gestión Inventario</p>
                  </div>
                </button>
                
                <button className="group relative overflow-hidden p-6 bg-gradient-to-br from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-orange-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💰</div>
                    <p className="text-sm font-black text-orange-900">Nueva Venta</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-md border-2 border-gray-100">
              <span className="text-2xl">🌾</span>
              <p className="text-sm font-bold text-gray-700">Sistema Granme CAPRI v1.0</p>
              <div className="w-px h-4 bg-gray-300"></div>
              <p className="text-xs text-gray-500">Última actualización: {new Date().toLocaleString('es-CO')}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
