import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { 
  Syringe, 
  Calendar, 
  Users, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Pill
} from 'lucide-react';
import aplicacionService from '../services/aplicacion.service';
import medicamentoService from '../services/medicamento.service';
import goatService from '../services/goat.service';
import type { AplicacionMedicamento, Medicamento, Goat } from '../types';
import { useNotifications } from '../context/NotificationContext';

const ApplicationsPage = () => {
  const [aplicaciones, setAplicaciones] = useState<AplicacionMedicamento[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [cabras, setCabras] = useState<Goat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMedicamento, setFilterMedicamento] = useState('');
  const [filterCabra, setFilterCabra] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingAplicacion, setEditingAplicacion] = useState<AplicacionMedicamento | null>(null);
  
  const { refreshNotifications } = useNotifications();

  // Estadísticas
  const [stats, setStats] = useState({
    totalAplicaciones: 0,
    aplicacionesEsteMes: 0,
    medicamentoMasUsado: '',
    proximasDosis: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aplicacionesData, medicamentosData, cabrasData, proximasDosis] = await Promise.all([
        aplicacionService.getAll(),
        medicamentoService.getAll(),
        goatService.getAll({ status: 'ACTIVE' }),
        aplicacionService.getProximasDosis(7)
      ]);

      setAplicaciones(aplicacionesData);
      setMedicamentos(medicamentosData);
      setCabras(cabrasData);

      // Calcular estadísticas
      const mesActual = new Date().getMonth();
      const aplicacionesMes = aplicacionesData.filter(app => {
        const mes = new Date(app.fechaAplicacion).getMonth();
        return mes === mesActual;
      });

      const medicamentosMasUsados = aplicacionesData.reduce((acc, app) => {
        const nombre = app.medicamento?.nombre || 'Desconocido';
        acc[nombre] = (acc[nombre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const masUsado = Object.entries(medicamentosMasUsados)
        .sort(([, a], [, b]) => b - a)[0];

      setStats({
        totalAplicaciones: aplicacionesData.length,
        aplicacionesEsteMes: aplicacionesMes.length,
        medicamentoMasUsado: masUsado ? masUsado[0] : 'N/A',
        proximasDosis: proximasDosis.length
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta aplicación?')) {
      try {
        await aplicacionService.delete(id);
        await loadData();
        refreshNotifications();
      } catch (error) {
        console.error('Error al eliminar aplicación:', error);
        alert('Error al eliminar la aplicación');
      }
    }
  };

  const handleEdit = (aplicacion: AplicacionMedicamento) => {
    setEditingAplicacion(aplicacion);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowBulkModal(false);
    setEditingAplicacion(null);
  };

  const handleSave = async () => {
    await loadData();
    refreshNotifications();
    handleCloseModal();
  };

  // Filtrar aplicaciones
  const aplicacionesFiltradas = aplicaciones.filter(app => {
    const matchSearch = !searchTerm || 
      app.goat?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.goat?.customId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.medicamento?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchMedicamento = !filterMedicamento || app.medicamentoId === filterMedicamento;
    const matchCabra = !filterCabra || app.goatId === filterCabra;

    return matchSearch && matchMedicamento && matchCabra;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando aplicaciones...</div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                  <Syringe className="w-12 h-12 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-4xl font-black mb-2">Aplicaciones de Medicamentos</h2>
                  <p className="text-white/90 text-lg font-semibold">
                    Registro y seguimiento de tratamientos médicos
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="group relative bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
                >
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Aplicación Masiva</span>
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="group relative bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-white/95 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Nueva Aplicación</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Estadísticas - Modernizadas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-10 -mt-10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Total Aplicaciones</p>
              <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalAplicaciones}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Syringe className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-10 -mt-10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Este Mes</p>
              <p className="text-3xl font-black text-blue-600 mt-2">{stats.aplicacionesEsteMes}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -mr-10 -mt-10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Más Usado</p>
              <p className="text-lg font-black text-indigo-600 mt-2 truncate">{stats.medicamentoMasUsado}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-10 -mt-10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Próximas Dosis</p>
              <p className="text-sm text-gray-500 font-semibold">Próximos 7 días</p>
              <p className="text-3xl font-black text-orange-600 mt-1">{stats.proximasDosis}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda - Mejorados */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cabra o medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <select
              value={filterMedicamento}
              onChange={(e) => setFilterMedicamento(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none transition-all font-medium bg-white"
            >
              <option value="">Todos los medicamentos</option>
              {medicamentos.map(med => (
                <option key={med.id} value={med.id}>
                  {med.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <select
              value={filterCabra}
              onChange={(e) => setFilterCabra(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none transition-all font-medium bg-white"
            >
              <option value="">Todas las cabras</option>
              {cabras.map(cabra => (
                <option key={cabra.id} value={cabra.id}>
                  {cabra.customId} - {cabra.name || 'Sin nombre'}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || filterMedicamento || filterCabra) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMedicamento('');
                setFilterCabra('');
              }}
              className="px-6 py-3 text-gray-700 font-bold border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla de aplicaciones - Mejorada */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Cabra
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Medicamento
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Dosis
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Vía
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Próxima Dosis
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {aplicacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <Syringe className="w-16 h-16 text-gray-400" />
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-2">No hay aplicaciones registradas</p>
                      <p className="text-sm text-gray-500">Comienza agregando una nueva aplicación</p>
                    </div>
                  </td>
                </tr>
              ) : (
                aplicacionesFiltradas.map((aplicacion) => {
                  const proximaDosis = aplicacion.proximaDosis ? new Date(aplicacion.proximaDosis) : null;
                  const hoy = new Date();
                  const diasRestantes = proximaDosis 
                    ? Math.ceil((proximaDosis.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <tr key={aplicacion.id} className="hover:bg-purple-50/30 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {new Date(aplicacion.fechaAplicacion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <span className="text-lg">🐐</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {aplicacion.goat?.customId}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {aplicacion.goat?.name || 'Sin nombre'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          {aplicacion.medicamento?.nombre}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {aplicacion.medicamento?.tipo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">
                          {aplicacion.dosis}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">
                          {aplicacion.viaAdministrada}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate font-medium">
                        {aplicacion.motivo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {proximaDosis ? (
                          <div>
                            <div className="text-gray-900 font-bold">
                              {proximaDosis.toLocaleDateString('es-ES')}
                            </div>
                            {diasRestantes !== null && (
                              <div className={`text-xs font-bold px-2 py-1 rounded-lg inline-block mt-1 ${
                                diasRestantes < 0 ? 'bg-red-100 text-red-700' :
                                diasRestantes <= 3 ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {diasRestantes < 0 ? '⚠️ Vencida' : 
                                 diasRestantes === 0 ? '📅 Hoy' :
                                 `⏱️ En ${diasRestantes}d`}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 font-medium">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {aplicacion.reaccionAdversa ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black bg-red-100 text-red-800 shadow-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Reacción
                          </span>
                        ) : aplicacion.efectividad === 'EXCELENTE' || aplicacion.efectividad === 'BUENA' ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black bg-green-100 text-green-800 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Exitosa
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black bg-gray-100 text-gray-800 shadow-sm">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(aplicacion)}
                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                            title="Editar"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(aplicacion.id)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {showModal && (
        <AplicacionModal
          aplicacion={editingAplicacion}
          medicamentos={medicamentos}
          cabras={cabras}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {showBulkModal && (
        <AplicacionMasivaModal
          medicamentos={medicamentos}
          cabras={cabras}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
      </div>
      </div>
    </Layout>
  );
};

// Modal para aplicación individual
const AplicacionModal = ({ 
  aplicacion, 
  medicamentos, 
  cabras, 
  onClose, 
  onSave 
}: {
  aplicacion: AplicacionMedicamento | null;
  medicamentos: Medicamento[];
  cabras: Goat[];
  onClose: () => void;
  onSave: () => void;
}) => {
  const [formData, setFormData] = useState({
    goatId: aplicacion?.goatId || '',
    medicamentoId: aplicacion?.medicamentoId || '',
    fechaAplicacion: aplicacion?.fechaAplicacion 
      ? new Date(aplicacion.fechaAplicacion).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    dosis: aplicacion?.dosis || '',
    viaAdministrada: aplicacion?.viaAdministrada || 'Oral',
    veterinario: aplicacion?.veterinario || '',
    aplicadoPor: aplicacion?.aplicadoPor || '',
    motivo: aplicacion?.motivo || '',
    proximaDosis: aplicacion?.proximaDosis 
      ? new Date(aplicacion.proximaDosis).toISOString().split('T')[0] 
      : '',
    frecuencia: aplicacion?.frecuencia || '',
    observaciones: aplicacion?.observaciones || ''
  });

  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<Medicamento | null>(null);

  useEffect(() => {
    if (formData.medicamentoId) {
      const med = medicamentos.find(m => m.id === formData.medicamentoId);
      setMedicamentoSeleccionado(med || null);
      if (med && !formData.dosis) {
        setFormData(prev => ({ ...prev, dosis: med.dosis || '' }));
      }
    }
  }, [formData.medicamentoId, medicamentos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (aplicacion) {
        await aplicacionService.update(aplicacion.id, formData);
      } else {
        await aplicacionService.create(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar aplicación:', error);
      alert('Error al guardar la aplicación');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-100 animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl shadow-lg z-10">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Syringe className="w-7 h-7" />
            {aplicacion ? 'Editar Aplicación' : 'Nueva Aplicación'}
          </h2>
          <p className="text-purple-100 mt-1 font-medium">
            {aplicacion ? 'Modificar los datos de la aplicación' : 'Registrar nueva aplicación de medicamento'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cabra */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Cabra *
              </label>
              <select
                required
                value={formData.goatId}
                onChange={(e) => setFormData({ ...formData, goatId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              >
                <option value="">Seleccionar cabra</option>
                {cabras.map(cabra => (
                  <option key={cabra.id} value={cabra.id}>
                    {cabra.customId} - {cabra.name || 'Sin nombre'}
                  </option>
                ))}
              </select>
            </div>

            {/* Medicamento */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Medicamento *
              </label>
              <select
                required
                value={formData.medicamentoId}
                onChange={(e) => setFormData({ ...formData, medicamentoId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              >
                <option value="">Seleccionar medicamento</option>
                {medicamentos.map(med => (
                  <option key={med.id} value={med.id}>
                    {med.nombre} ({med.tipo})
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de aplicación */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Fecha de Aplicación *
              </label>
              <input
                type="date"
                required
                value={formData.fechaAplicacion}
                onChange={(e) => setFormData({ ...formData, fechaAplicacion: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              />
            </div>

            {/* Dosis */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Dosis *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 5ml, 2 tabletas, 10mg"
                value={formData.dosis}
                onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              />
              {medicamentoSeleccionado?.dosis && (
                <p className="text-xs font-bold text-purple-600 mt-2">
                  💡 Dosis recomendada: {medicamentoSeleccionado.dosis}
                </p>
              )}
            </div>

            {/* Vía de administración */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Vía de Administración *
              </label>
              <select
                required
                value={formData.viaAdministrada}
                onChange={(e) => setFormData({ ...formData, viaAdministrada: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              >
                <option value="Oral">Oral</option>
                <option value="Intramuscular">Intramuscular</option>
                <option value="Subcutánea">Subcutánea</option>
                <option value="Intravenosa">Intravenosa</option>
                <option value="Tópica">Tópica</option>
                <option value="Oftálmica">Oftálmica</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Veterinario */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Veterinario
              </label>
              <input
                type="text"
                placeholder="Nombre del veterinario"
                value={formData.veterinario}
                onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              />
            </div>

            {/* Aplicado por */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Aplicado Por
              </label>
              <input
                type="text"
                placeholder="Persona que aplicó"
                value={formData.aplicadoPor}
                onChange={(e) => setFormData({ ...formData, aplicadoPor: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              />
            </div>

            {/* Frecuencia */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Frecuencia
              </label>
              <input
                type="text"
                placeholder="Ej: Cada 12 horas, Diario"
                value={formData.frecuencia}
                onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              />
            </div>

            {/* Próxima dosis */}
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Próxima Dosis
              </label>
              <input
                type="date"
                value={formData.proximaDosis}
                onChange={(e) => setFormData({ ...formData, proximaDosis: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
              />
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Motivo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Vacunación anual, Tratamiento infección"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all"
            />
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              rows={4}
              placeholder="Notas adicionales, reacciones o indicaciones especiales..."
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 font-medium transition-all resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 font-bold border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-black shadow-lg hover:shadow-xl hover:scale-105"
            >
              {aplicacion ? '✓ Actualizar' : '+ Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para aplicación masiva
const AplicacionMasivaModal = ({
  medicamentos,
  cabras,
  onClose,
  onSave
}: {
  medicamentos: Medicamento[];
  cabras: Goat[];
  onClose: () => void;
  onSave: () => void;
}) => {
  const [selectedGoats, setSelectedGoats] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [formData, setFormData] = useState({
    medicamentoId: '',
    fechaAplicacion: new Date().toISOString().split('T')[0],
    dosis: '',
    viaAdministrada: 'Intramuscular',
    veterinario: '',
    aplicadoPor: '',
    motivo: '',
    observaciones: ''
  });

  const handleToggleGoat = (goatId: string) => {
    setSelectedGoats(prev =>
      prev.includes(goatId)
        ? prev.filter(id => id !== goatId)
        : [...prev, goatId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedGoats([]);
    } else {
      setSelectedGoats(cabras.map(c => c.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGoats.length === 0) {
      alert('Debes seleccionar al menos una cabra');
      return;
    }

    try {
      await aplicacionService.createBulk(selectedGoats, formData);
      onSave();
    } catch (error) {
      console.error('Error al crear aplicaciones masivas:', error);
      alert('Error al crear las aplicaciones');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-100 animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl shadow-lg z-10">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Users className="w-7 h-7" />
            Aplicación Masiva
          </h2>
          <p className="text-indigo-100 mt-1 font-medium">
            Aplicar medicamento a múltiples cabras a la vez
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Información del medicamento */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Información del Tratamiento</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  Medicamento *
                </label>
                <select
                  required
                  value={formData.medicamentoId}
                  onChange={(e) => setFormData({ ...formData, medicamentoId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                >
                  <option value="">Seleccionar medicamento</option>
                  {medicamentos.map(med => (
                    <option key={med.id} value={med.id}>
                      {med.nombre} ({med.tipo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  Fecha de Aplicación *
                </label>
                <input
                  type="date"
                  required
                  value={formData.fechaAplicacion}
                  onChange={(e) => setFormData({ ...formData, fechaAplicacion: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  Dosis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 5ml por cabra"
                  value={formData.dosis}
                  onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  Vía de Administración *
                </label>
                <select
                  required
                  value={formData.viaAdministrada}
                  onChange={(e) => setFormData({ ...formData, viaAdministrada: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                >
                  <option value="Oral">Oral</option>
                  <option value="Intramuscular">Intramuscular</option>
                  <option value="Subcutánea">Subcutánea</option>
                  <option value="Intravenosa">Intravenosa</option>
                  <option value="Tópica">Tópica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  Veterinario
                </label>
                <input
                  type="text"
                  placeholder="Nombre del veterinario"
                  value={formData.veterinario}
                  onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  Aplicado Por
                </label>
                <input
                  type="text"
                  placeholder="Persona que aplicó"
                  value={formData.aplicadoPor}
                  onChange={(e) => setFormData({ ...formData, aplicadoPor: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Motivo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Vacunación anual, Desparasitación"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                rows={3}
                placeholder="Notas adicionales..."
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all resize-none"
              />
            </div>
          </div>

          {/* Selección de cabras */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Seleccionar Cabras</h3>
                  <p className="text-sm font-bold text-indigo-600">{selectedGoats.length} cabras seleccionadas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-6 py-3 text-indigo-700 hover:text-indigo-900 font-black border-2 border-indigo-300 rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
              >
                {selectAll ? '✓ Deseleccionar todas' : '☑ Seleccionar todas'}
              </button>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl max-h-80 overflow-y-auto bg-gradient-to-br from-gray-50 to-white shadow-inner">
              {cabras.map(cabra => (
                <div
                  key={cabra.id}
                  className={`flex items-center p-4 border-b-2 border-gray-100 last:border-b-0 transition-all duration-300 cursor-pointer ${
                    selectedGoats.includes(cabra.id) 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleToggleGoat(cabra.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedGoats.includes(cabra.id)}
                    onChange={() => handleToggleGoat(cabra.id)}
                    className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-4 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <div className="ml-4 flex-1">
                    <div className="text-base font-black text-gray-900">
                      {cabra.customId} - {cabra.name || 'Sin nombre'}
                    </div>
                    <div className="text-sm font-bold text-gray-600 mt-1">
                      {cabra.breed} | {cabra.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 font-bold border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={selectedGoats.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-black shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              💉 Aplicar a {selectedGoats.length} cabra{selectedGoats.length !== 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationsPage;
