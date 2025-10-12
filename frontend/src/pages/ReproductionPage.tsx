import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { 
  Heart, 
  Plus, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Baby,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import montaService from '../services/monta.service';
import MontaModal from '../components/MontaModal';
import PartoModal from '../components/PartoModal';
import { useNotifications } from '../context/NotificationContext';
import type { 
  Monta,
  GestacionActiva,
  EstadisticasReproduccion,
  Goat,
  TipoEventoMonta,
  CreateMontaData,
  RegistrarPartoData
} from '../types';

export default function ReproductionPage() {
  const [montas, setMontas] = useState<Monta[]>([]);
  const [gestaciones, setGestaciones] = useState<GestacionActiva[]>([]);
  const [stats, setStats] = useState<EstadisticasReproduccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('');
  const [showProximosPartos, setShowProximosPartos] = useState(true);

  // Estados de modales
  const [isMontaModalOpen, setIsMontaModalOpen] = useState(false);
  const [isPartoModalOpen, setIsPartoModalOpen] = useState(false);
  const [selectedMontaForParto, setSelectedMontaForParto] = useState<{ id: string; hembraNombre: string } | null>(null);

  // Hook de notificaciones
  const { refreshNotifications } = useNotifications();

  // Cargar datos
  useEffect(() => {
    loadData();
  }, [filterEstado]);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters = filterEstado ? { tipoEvento: filterEstado } : {};
      
      const [montasData, gestacionesData, statsData] = await Promise.all([
        montaService.getAll(filters),
        montaService.getGestacionesActivas(),
        montaService.getEstadisticas(),
      ]);

      setMontas(montasData);
      setGestaciones(gestacionesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos de reproducción:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar creación de monta
  const handleSaveMonta = async (data: CreateMontaData) => {
    try {
      await montaService.create(data);
      await loadData();
      await refreshNotifications();
    } catch (error) {
      console.error('Error al guardar monta:', error);
      throw error;
    }
  };

  // Manejar registro de parto
  const handleSaveParto = async (montaId: string, data: RegistrarPartoData) => {
    try {
      await montaService.registrarParto(montaId, data);
      await loadData();
      await refreshNotifications();
    } catch (error) {
      console.error('Error al registrar parto:', error);
      throw error;
    }
  };

  // Abrir modal de parto para una monta específica
  const handleOpenPartoPara = (monta: Monta) => {
    const hembra = monta.hembra as Goat;
    const hembraNombre = `${hembra.customId}${hembra.name ? ` - ${hembra.name}` : ''}`;
    
    setSelectedMontaForParto({
      id: monta.id,
      hembraNombre,
    });
    setIsPartoModalOpen(true);
  };

  // Eliminar monta
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta monta?')) {
      return;
    }

    try {
      await montaService.delete(id);
      await loadData();
      await refreshNotifications();
    } catch (error) {
      console.error('Error al eliminar monta:', error);
      alert('Error al eliminar la monta');
    }
  };

  // Filtrar montas por búsqueda
  const filteredMontas = montas.filter(monta => {
    const hembra = monta.hembra as Goat;
    const macho = monta.macho as Goat;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      hembra.customId?.toLowerCase().includes(searchLower) ||
      hembra.name?.toLowerCase().includes(searchLower) ||
      macho.customId?.toLowerCase().includes(searchLower) ||
      macho.name?.toLowerCase().includes(searchLower)
    );
  });

  // Función para obtener badge de resultado
  const getResultadoBadge = (tipoEvento: TipoEventoMonta) => {
    if (!tipoEvento || tipoEvento === 'GESTACION') {
      return (
        <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-200">
          <Clock className="w-3 h-3 inline mr-1" />
          En Gestación
        </span>
      );
    }
    if (tipoEvento === 'PARTO_EXITOSO') {
      return (
        <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
          <CheckCircle className="w-3 h-3 inline mr-1" />
          Parto Exitoso
        </span>
      );
    }
    if (tipoEvento === 'SIN_GESTACION') {
      return (
        <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 text-xs font-semibold rounded-full border border-red-200">
          <XCircle className="w-3 h-3 inline mr-1" />
          Sin Gestación
        </span>
      );
    }
    if (tipoEvento === 'ABORTO') {
      return (
        <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-xs font-semibold rounded-full border border-orange-200">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Aborto
        </span>
      );
    }
    if (tipoEvento === 'PARTO_COMPLICADO') {
      return (
        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-semibold rounded-full border border-purple-200">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Parto Complicado
        </span>
      );
    }
    return null;
  };

  // Función para obtener clase de prioridad de parto
  const getPartoPriorityClass = (diasRestantes: number) => {
    if (diasRestantes <= 7) return 'border-l-4 border-red-500 bg-red-50';
    if (diasRestantes <= 15) return 'border-l-4 border-yellow-500 bg-yellow-50';
    return 'border-l-4 border-emerald-500 bg-emerald-50';
  };

  // Función para formatear fecha
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header - Modernizado */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg mb-6 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-rose-600 to-red-700"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                  <span className="text-5xl">❤️</span>
                </div>
                <div className="text-white">
                  <h2 className="text-4xl font-black mb-2">Control Reproductivo</h2>
                  <p className="text-white/90 text-lg font-semibold">
                    Gestión de montas, gestaciones y partos
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsMontaModalOpen(true)}
                className="group relative bg-white text-pink-700 px-6 py-3 rounded-xl font-bold hover:bg-white/95 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>Registrar Monta</span>
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas - Modernizadas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-100 to-transparent rounded-full -mr-10 -mt-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Total Montas</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalMontas}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-10 -mt-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Gestaciones Activas</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{stats.gestacionesActivas}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                  <Baby className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-10 -mt-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Tasa de Éxito</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{stats.tasaExito}%</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-10 -mt-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Próximos Partos (30d)</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{gestaciones.filter(g => g.diasRestantes <= 30).length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gestaciones Activas y Próximos Partos */}
        {showProximosPartos && gestaciones.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Baby className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-gray-800">Gestaciones Activas</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                    {gestaciones.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowProximosPartos(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {gestaciones.slice(0, 5).map((gestacion) => {
                const hembra = gestacion.hembra as Goat;
                return (
                  <div
                    key={gestacion.id}
                    className={`p-4 rounded-xl transition-all ${getPartoPriorityClass(gestacion.diasRestantes)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {hembra.customId} {hembra.name && `- ${hembra.name}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              Fecha de monta: {formatDate(gestacion.fechaMonta)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">Parto estimado</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatDate(gestacion.fechaEstimadaParto)}
                        </p>
                        <p className={`text-sm font-semibold mt-1 ${
                          gestacion.diasRestantes <= 7 ? 'text-red-600' :
                          gestacion.diasRestantes <= 15 ? 'text-yellow-600' :
                          'text-emerald-600'
                        }`}>
                          {gestacion.diasRestantes} días restantes
                        </p>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            gestacion.diasRestantes <= 7 ? 'bg-red-500' :
                            gestacion.diasRestantes <= 15 ? 'bg-yellow-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.round((gestacion.diasGestacion / 150) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {Math.round((gestacion.diasGestacion / 150) * 100)}% completado
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtros y Búsqueda - Modernizados */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 animate-fade-in">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-pink-100/40 to-transparent rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por arete de hembra o macho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium shadow-sm"
              />
            </div>
            
            <div className="relative min-w-[220px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all appearance-none bg-white font-bold shadow-sm"
              >
                <option value="">Todos los estados</option>
                <option value="GESTACION">En Gestación</option>
                <option value="PARTO_EXITOSO">Parto Exitoso</option>
                <option value="SIN_GESTACION">Sin Gestación</option>
                <option value="ABORTO">Aborto</option>
                <option value="PARTO_COMPLICADO">Parto Complicado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Montas - Modernizada */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 border-gray-100 animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-100/40 to-transparent rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-600" />
              <h2 className="text-xl font-black text-gray-800">Registro de Montas</h2>
              <span className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 text-sm font-black rounded-full border-2 border-pink-200 shadow-sm">
                {filteredMontas.length}
              </span>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-pink-100 to-rose-100">
                  <th className="px-6 py-4 text-left text-sm font-black text-pink-900 uppercase tracking-wide">
                    Hembra
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-pink-900 uppercase tracking-wide">
                    Macho
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-pink-900 uppercase tracking-wide">
                    Fecha Monta
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-pink-900 uppercase tracking-wide">
                    Parto Estimado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-pink-900 uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-pink-900 uppercase tracking-wide">
                    Resultado
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-black text-pink-900 uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMontas.map((monta) => {
                  const hembra = monta.hembra as Goat;
                  const macho = monta.macho as Goat;
                  
                  return (
                    <tr key={monta.id} className="hover:bg-gradient-to-r hover:from-pink-50/20 hover:to-transparent transition-all duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{hembra.customId}</p>
                          {hembra.name && (
                            <p className="text-sm text-gray-500">{hembra.name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{macho.customId}</p>
                          {macho.name && (
                            <p className="text-sm text-gray-500">{macho.name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(monta.fechaMonta)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(monta.fechaEstimadaParto)}
                      </td>
                      <td className="px-6 py-4">
                        {monta.tipoEvento === 'GESTACION' ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
                            En Gestación
                          </span>
                        ) : monta.fechaParto ? (
                          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">
                            Finalizada
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 text-xs font-semibold rounded-full border border-gray-200">
                            Registrada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getResultadoBadge(monta.tipoEvento)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Botón de Registrar Parto (solo si está en gestación) */}
                          {monta.tipoEvento === 'GESTACION' && (
                            <button
                              onClick={() => handleOpenPartoPara(monta)}
                              className="group px-3 py-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all hover:scale-105 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-md flex items-center gap-2"
                              title="Registrar Parto"
                            >
                              <Baby className="w-4 h-4" />
                              <span className="text-sm font-semibold">Parto</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(monta.id)}
                            className="group p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110 border-2 border-transparent hover:border-red-200 hover:shadow-md"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredMontas.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-white">
                <span className="text-7xl">❤️</span>
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-900">No hay montas registradas</h3>
              <p className="text-base text-gray-600 font-medium">No se encontraron montas en el sistema</p>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Modales */}
      <MontaModal
        isOpen={isMontaModalOpen}
        onClose={() => setIsMontaModalOpen(false)}
        onSave={handleSaveMonta}
      />

      {selectedMontaForParto && (
        <PartoModal
          isOpen={isPartoModalOpen}
          montaId={selectedMontaForParto.id}
          hembraNombre={selectedMontaForParto.hembraNombre}
          onClose={() => {
            setIsPartoModalOpen(false);
            setSelectedMontaForParto(null);
          }}
          onSave={handleSaveParto}
        />
      )}
    </Layout>
  );
}
