import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  Heart, 
  Pill,
  Syringe,
  Milk,
  Users,
  Package
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0d8] via-[#d4e8ba] to-[#c0e09c]">
      {/* Header/Navbar */}
      <nav className="bg-[#1a2e02] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐐</span>
              <h1 className="text-2xl font-bold">Granme</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-white hover:text-[#c0e09c] transition-colors font-medium"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-[#4a7c0b] hover:bg-[#5a9c1b] text-white rounded-lg font-semibold transition-colors shadow-md"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-black transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Diseño moderno y específico para CAPRI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-emerald-200 mb-8 hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-black text-emerald-700">Sistema Profesional de Gestión Caprina</span>
          </div>
          
          {/* Título principal con gradiente */}
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Gestiona tu granja
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              de forma inteligente
            </span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-4 font-medium leading-relaxed">
            <span className="font-black text-emerald-700">CAPRI</span> es la plataforma completa para el control sanitario, 
            reproductivo y productivo de tu rebaño caprino.
          </p>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Medicamentos • Reproducción • Producción de Leche • Inventario • Reportes
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/login')}
              className="group px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Acceder al Sistema
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-5 bg-white hover:bg-gray-50 text-emerald-700 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all border-2 border-emerald-300 hover:border-emerald-400 hover:scale-105"
            >
              Crear Cuenta Nueva
            </button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">100%</div>
              <div className="text-sm font-bold text-gray-600">Control del Rebaño</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">24/7</div>
              <div className="text-sm font-bold text-gray-600">Monitoreo Salud</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-cyan-100 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Milk className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">Live</div>
              <div className="text-sm font-bold text-gray-600">Producción</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100 hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">Auto</div>
              <div className="text-sm font-bold text-gray-600">Reportes</div>
            </div>
          </div>
        </div>

        {/* Módulos Principales - Específicos de CAPRI */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Módulos del Sistema
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Todo lo que necesitas para gestionar tu granja caprina en un solo lugar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Módulo Cabras */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-emerald-100 hover:border-emerald-300 hover:scale-105">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <PawPrint className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Gestión de Cabras</h3>
              <p className="text-gray-600 font-medium mb-4">
                Control completo del rebaño: registro de cabras, categorías, razas, 
                historial médico y seguimiento individual.
              </p>
              <div className="flex items-center text-emerald-600 font-bold group-hover:gap-3 gap-2 transition-all">
                <span>Explorar módulo</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Módulo Medicamentos */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-cyan-100 hover:border-cyan-300 hover:scale-105">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Pill className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Medicamentos</h3>
              <p className="text-gray-600 font-medium mb-4">
                Inventario de medicamentos, alertas de vencimiento y stock bajo, 
                registro de tipos y dosis recomendadas.
              </p>
              <div className="flex items-center text-cyan-600 font-bold group-hover:gap-3 gap-2 transition-all">
                <span>Explorar módulo</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Módulo Aplicaciones */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-purple-100 hover:border-purple-300 hover:scale-105">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Syringe className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Aplicaciones</h3>
              <p className="text-gray-600 font-medium mb-4">
                Registro de aplicaciones médicas individuales y masivas, 
                calendario de próximas dosis y historial completo.
              </p>
              <div className="flex items-center text-purple-600 font-bold group-hover:gap-3 gap-2 transition-all">
                <span>Explorar módulo</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Módulo Reproducción */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-pink-100 hover:border-pink-300 hover:scale-105">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Reproducción</h3>
              <p className="text-gray-600 font-medium mb-4">
                Control de montas, gestaciones activas, registro de partos, 
                seguimiento de crías y estadísticas reproductivas.
              </p>
              <div className="flex items-center text-pink-600 font-bold group-hover:gap-3 gap-2 transition-all">
                <span>Explorar módulo</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Módulo Producción */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-blue-100 hover:border-blue-300 hover:scale-105">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Milk className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Producción de Leche</h3>
              <p className="text-gray-600 font-medium mb-4">
                Registro diario de producción, análisis de rendimiento por cabra, 
                gráficas y tendencias de producción.
              </p>
              <div className="flex items-center text-blue-600 font-bold group-hover:gap-3 gap-2 transition-all">
                <span>Explorar módulo</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Módulo Reportes */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-amber-100 hover:border-amber-300 hover:scale-105">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Reportes y Análisis</h3>
              <p className="text-gray-600 font-medium mb-4">
                Dashboard con métricas en tiempo real, gráficas interactivas, 
                exportación a PDF y análisis por raza.
              </p>
              <div className="flex items-center text-amber-600 font-bold group-hover:gap-3 gap-2 transition-all">
                <span>Explorar módulo</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Características Premium del Sistema */}
        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-2xl p-12 border-2 border-emerald-200 mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-4">
            ¿Por qué elegir CAPRI?
          </h2>
          <p className="text-center text-xl text-gray-600 font-medium mb-12 max-w-3xl mx-auto">
            Sistema diseñado específicamente para granjas caprinas con funcionalidades avanzadas
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900 mb-2">Interfaz Moderna</h4>
                <p className="text-gray-600 font-medium">
                  Diseño intuitivo y fácil de usar. Accede a toda la información 
                  de forma rápida y eficiente.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900 mb-2">Seguridad Total</h4>
                <p className="text-gray-600 font-medium">
                  Datos protegidos con encriptación moderna. 
                  Control de acceso por roles y permisos.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900 mb-2">Notificaciones Inteligentes</h4>
                <p className="text-gray-600 font-medium">
                  Alertas automáticas de próximos partos, medicamentos por vencer 
                  y stock bajo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900 mb-2">Reportes Automáticos</h4>
                <p className="text-gray-600 font-medium">
                  Genera reportes en PDF con gráficas y estadísticas. 
                  Dashboard en tiempo real.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900 mb-2">Calendarios Inteligentes</h4>
                <p className="text-gray-600 font-medium">
                  Seguimiento de gestaciones, próximas dosis de medicamentos 
                  y eventos importantes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg text-gray-900 mb-2">Análisis Avanzado</h4>
                <p className="text-gray-600 font-medium">
                  Estadísticas por raza, rendimiento reproductivo, 
                  producción de leche y más.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final - Llamado a la acción */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl shadow-2xl p-12 md:p-16 text-center text-white">
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Comienza a gestionar tu granja hoy
            </h2>
            
            <p className="text-xl md:text-2xl text-emerald-100 mb-3 max-w-3xl mx-auto font-medium">
              Únete al futuro de la gestión caprina con <span className="font-black">CAPRI</span>
            </p>
            
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Sistema profesional diseñado para optimizar cada aspecto de tu operación
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="group px-10 py-5 bg-white text-emerald-700 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <Activity className="w-6 h-6" />
                Iniciar Sesión Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-5 bg-emerald-800/50 backdrop-blur-sm hover:bg-emerald-800/70 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all border-2 border-white/30 hover:scale-105"
              >
                Crear Cuenta Gratis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Moderno y limpio */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Logo y descripción */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <PawPrint className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-black text-2xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">CAPRI</span>
                  <p className="text-xs text-gray-400 font-bold">Gestión Caprina</p>
                </div>
              </div>
              <p className="text-gray-400 font-medium">
                Sistema profesional para la administración integral de granjas caprinas.
              </p>
            </div>

            {/* Módulos */}
            <div>
              <h4 className="font-black text-lg mb-4 text-emerald-400">Módulos</h4>
              <ul className="space-y-2 text-gray-400 font-medium">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Gestión de Cabras</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Medicamentos</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Aplicaciones Médicas</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Reproducción</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Producción de Leche</li>
              </ul>
            </div>

            {/* Información */}
            <div>
              <h4 className="font-black text-lg mb-4 text-emerald-400">Sistema</h4>
              <ul className="space-y-2 text-gray-400 font-medium">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Dashboard</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Reportes</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Notificaciones</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">→ Configuración</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm font-medium">
              © 2025 <span className="font-black text-emerald-400">CAPRI</span> - Sistema de Gestión Caprina. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400 font-bold">Sistema Activo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
