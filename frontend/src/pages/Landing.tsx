import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  Heart, 
  Pill,
  Syringe,
  Milk,
  Users,
  Package,
  Shield,
  TrendingUp
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-md mb-6">
            <span className="text-2xl">🌿</span>
            <span className="text-sm font-semibold text-[#2a4a04]">Sistema de Gestión Interno</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a2e02] mb-6">
            Sistema Granme
            <br />
            <span className="text-[#4a7c0b]">Gestión de Granja Caprina</span>
          </h1>
          
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Plataforma integral para el control y administración de tu granja.
            Optimiza el manejo del rebaño, inventario, producción y ventas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-[#4a7c0b] hover:bg-[#5a9c1b] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Acceder al Sistema
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-[#4a7c0b] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-[#4a7c0b]"
            >
              Crear Nueva Cuenta
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Rebaño</h3>
            <p className="text-gray-600">
              Registra y controla cada cabra del rebaño. Monitorea salud, 
              reproducción, producción de leche y medicamentos.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Reportes y Estadísticas</h3>
            <p className="text-gray-600">
              Genera reportes en PDF con gráficas interactivas. Visualiza el rendimiento 
              de tu granja en tiempo real.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-purple-500">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Inventario y Ventas</h3>
            <p className="text-gray-600">
              Controla productos, proveedores y ventas. Gestiona el flujo de ingresos 
              de tu negocio.
            </p>
          </div>
        </div>

        {/* Módulos Adicionales */}
        <div className="mt-24 bg-white rounded-2xl shadow-2xl p-12">
          <h2 className="text-3xl font-bold text-center text-[#1a2e02] mb-12">
            Módulos del Sistema
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Pill className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Control de Medicamentos</h4>
                <p className="text-gray-600">
                  Gestiona el inventario de medicamentos, alertas de vencimiento, 
                  aplicaciones y tratamientos médicos.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Gestión Reproductiva</h4>
                <p className="text-gray-600">
                  Control de montas, gestaciones, partos y seguimiento de crías. 
                  Calendario automático de próximos partos.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Milk className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Producción de Leche</h4>
                <p className="text-gray-600">
                  Registro diario de producción por cabra. 
                  Análisis de rendimiento y tendencias.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Syringe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Aplicaciones Médicas</h4>
                <p className="text-gray-600">
                  Registro individual y masivo de aplicaciones. 
                  Calendario de próximas dosis automático.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Seguridad</h4>
                <p className="text-gray-600">
                  Datos protegidos con encriptación moderna. 
                  Control de acceso por roles de usuario.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Análisis y Optimización</h4>
                <p className="text-gray-600">
                  Estadísticas por raza, análisis de eficiencia y 
                  recomendaciones para mejorar la operación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-[#4a7c0b] to-[#2a4a04] rounded-2xl shadow-2xl p-12 text-center text-white">
          <div className="text-5xl mb-6">🐐</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sistema Interno de la Granja
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Software diseñado específicamente para la gestión eficiente de tu operación caprina.
            Accede con tus credenciales autorizadas.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-white text-[#4a7c0b] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2e02] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐐</span>
              <span className="font-bold text-lg">Granme</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Granme. Sistema de Gestión de Granja Caprina. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
