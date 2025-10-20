import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import goatService from '../services/goat.service';
import { saleService } from '../services/sale.service';
import { 
  ArrowRight, 
  TrendingUp, 
  BarChart3,
  FileText,
  Users,
  Package,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const [goatStats, , allSales] = await Promise.all([
        goatService.getStats(),
        goatService.getAll(),
        saleService.getAll()
      ]);

      setStats({
        totalGoats: goatStats.total,
        totalProduction: goatStats.totalMilkProduction,
        totalSales: allSales.length,
        totalRevenue: allSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const quickActions = [
    { title: 'Registro Caprino', description: 'Gestiona tu rebaño', icon: '🐐', color: 'from-[#4a7c0b] to-[#6b7c45]', route: '/goats' },
    { title: 'Nueva Venta', description: 'Registra una venta', icon: '💰', color: 'from-blue-500 to-blue-600', route: '/ventas' },
    { title: 'Ver Reportes', description: 'Estadísticas y gráficas', icon: '📊', color: 'from-purple-500 to-purple-600', route: '/reportes' },
    { title: 'Dashboard', description: 'Panel de control', icon: '📈', color: 'from-teal-500 to-teal-600', route: '/dashboard' }
  ];

  const features = [
    { icon: <Users className="w-5 h-5" />, title: 'Gestión Completa', description: 'Control total de tu rebaño, inventario y personal' },
    { icon: <BarChart3 className="w-5 h-5" />, title: 'Reportes Avanzados', description: 'Gráficas interactivas y reportes en PDF' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Análisis en Tiempo Real', description: 'Métricas actualizadas de producción y ventas' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0d8] via-[#d4e8ba] to-[#c0e09c] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Banner Mejorado */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e02] via-[#2a4a04] to-[#4a7c0b]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            
            <div className="relative p-10 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl animate-bounce-slow">
                      <span className="text-5xl">🐐</span>
                    </div>
                    <div>
                      <p className="text-[#c0e09c] font-bold text-lg uppercase tracking-wider">{greeting}</p>
                      <h1 className="text-4xl md:text-5xl font-black mb-2">{user?.name || 'Usuario'}</h1>
                      <p className="text-white/90 text-xl font-semibold">Bienvenido al sistema de gestión de tu granja</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-6 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 w-fit border border-white/20">
                    <span className="text-2xl">{user?.role === 'COORDINADOR' ? '👑' : user?.role === 'EMPLEADO' ? '👤' : '🎓'}</span>
                    <div>
                      <p className="text-xs text-white/70 uppercase font-bold tracking-wide">Tu Rol</p>
                      <p className="text-lg font-black">{user?.role === 'COORDINADOR' ? 'Coordinador' : user?.role === 'EMPLEADO' ? 'Empleado' : 'Pasante'}</p>
                    </div>
                  </div>
                </div>

                {!isLoading && stats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300 group">
                      <p className="text-white/80 text-xs font-bold uppercase mb-1">Cabras</p>
                      <p className="text-4xl font-black text-white group-hover:scale-110 transition-transform">{stats.totalGoats}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300 group">
                      <p className="text-white/80 text-xs font-bold uppercase mb-1">Producción</p>
                      <p className="text-4xl font-black text-white group-hover:scale-110 transition-transform">{stats.totalProduction.toFixed(0)}L</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300 group">
                      <p className="text-white/80 text-xs font-bold uppercase mb-1">Ventas</p>
                      <p className="text-4xl font-black text-white group-hover:scale-110 transition-transform">{stats.totalSales}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300 group">
                      <p className="text-white/80 text-xs font-bold uppercase mb-1">Ingresos</p>
                      <p className="text-3xl font-black text-white group-hover:scale-110 transition-transform">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-7 h-7 text-[#4a7c0b]" />
              <h2 className="text-3xl font-black text-[#1a2e02]">Acciones Rápidas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.route)}
                  className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-[#4a7c0b]/30"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className={`bg-gradient-to-br ${action.color} p-4 rounded-2xl shadow-md mb-4 inline-block group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-4xl">{action.icon}</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 font-medium mb-3">{action.description}</p>
                    <div className="flex items-center gap-2 text-[#4a7c0b] font-bold text-sm">
                      <span>Ir ahora</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-7 h-7 text-[#4a7c0b]" />
              <h2 className="text-3xl font-black text-[#1a2e02]">Funcionalidades</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="relative overflow-hidden bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e8f0d8] to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-[#4a7c0b] to-[#6b7c45] p-3 rounded-xl shadow-md mb-4 inline-block text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What You Can Do */}
          <div className="relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#e8f0d8] to-transparent rounded-full -mr-20 -mt-20"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-7 h-7 text-[#4a7c0b]" />
                <h2 className="text-3xl font-black text-[#1a2e02]">¿Qué puedes hacer?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Registrar y gestionar cabras',
                  'Control de producción de leche',
                  'Gestión de ventas y clientes',
                  'Administrar inventario',
                  'Generar reportes detallados',
                  'Análisis de datos en tiempo real'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-[#e8f0d8] p-4 rounded-xl hover:bg-[#d3dbb8] transition-colors duration-200">
                    <CheckCircle2 className="w-5 h-5 text-[#4a7c0b] flex-shrink-0" />
                    <span className="text-sm font-bold text-[#1a2e02]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative bg-gradient-to-r from-[#2a4a04] to-[#4a7c0b] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4a7c0b] to-[#6b7c45] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-3">
                <span>Todo listo para trabajar. Accede al panel principal</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
