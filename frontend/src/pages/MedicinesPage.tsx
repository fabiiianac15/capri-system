import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  TrendingDown,
  Search,
  Filter,
  Edit2,
  Trash2,
  Archive,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import medicamentoService from '../services/medicamento.service';
import MedicamentoModal from '../components/MedicamentoModal';
import StockAdjustmentModal from '../components/StockAdjustmentModal';
import { useNotifications } from '../context/NotificationContext';
import type { 
  Medicamento, 
  AlertaMedicamento, 
  TipoMedicamento,
  EstadisticasMedicamentos,
  CreateMedicamentoData,
  UpdateMedicamentoData
} from '../types';

export default function MedicinesPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [alertas, setAlertas] = useState<AlertaMedicamento[]>([]);
  const [stats, setStats] = useState<EstadisticasMedicamentos | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [showAlertas, setShowAlertas] = useState(true);
  
  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState<Medicamento | undefined>();
  
  // Estados del modal de stock
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockMedicamento, setStockMedicamento] = useState<Medicamento | null>(null);
  
  // Hook de notificaciones
  const { refreshNotifications } = useNotifications();

  // Cargar datos
  useEffect(() => {
    loadData();
  }, [filterTipo]);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters = filterTipo ? { tipo: filterTipo, activo: true } : { activo: true };
      
      const [medsData, alertasData, statsData] = await Promise.all([
        medicamentoService.getAll(filters),
        medicamentoService.getAlertas(),
        medicamentoService.getEstadisticas(),
      ]);

      setMedicamentos(medsData);
      setAlertas(alertasData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar creación/edición
  const handleSaveMedicamento = async (data: CreateMedicamentoData) => {
    try {
      if (selectedMedicamento) {
        // Actualizar
        await medicamentoService.update(selectedMedicamento.id, data as UpdateMedicamentoData);
      } else {
        // Crear
        await medicamentoService.create(data);
      }
      await loadData();
      // Refrescar notificaciones después de guardar
      await refreshNotifications();
    } catch (error) {
      console.error('Error al guardar medicamento:', error);
      throw error;
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedMedicamento(undefined);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (medicamento: Medicamento) => {
    setSelectedMedicamento(medicamento);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedicamento(undefined);
  };

  // Eliminar medicamento
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este medicamento?')) {
      return;
    }

    try {
      await medicamentoService.delete(id);
      await loadData();
      // Refrescar notificaciones después de eliminar
      await refreshNotifications();
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
    }
  };

  // Abrir modal de ajuste de stock (incrementar)
  const handleOpenStockIncrement = (medicamento: Medicamento) => {
    setStockMedicamento(medicamento);
    setIsStockModalOpen(true);
  };

  // Abrir modal de ajuste de stock (decrementar)
  const handleOpenStockDecrement = (medicamento: Medicamento) => {
    setStockMedicamento(medicamento);
    setIsStockModalOpen(true);
  };

  // Guardar ajuste de stock
  const handleSaveStockAdjustment = async (cantidad: number, operacion: 'INCREMENTAR' | 'DECREMENTAR') => {
    if (!stockMedicamento) return;

    try {
      await medicamentoService.updateStock(stockMedicamento.id, cantidad, operacion);
      await loadData();
      // Refrescar notificaciones después de ajustar stock
      await refreshNotifications();
      setIsStockModalOpen(false);
      setStockMedicamento(null);
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      throw error;
    }
  };

  // Cerrar modal de stock
  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
    setStockMedicamento(null);
  };

  // Filtrar medicamentos por búsqueda
  const filteredMedicamentos = medicamentos.filter(med =>
    med.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.fabricante && med.fabricante.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para obtener color del badge de tipo
  const getTipoBadgeColor = (tipo: TipoMedicamento) => {
    const colors: Record<TipoMedicamento, string> = {
      VACUNA: 'bg-blue-100 text-blue-800',
      ANTIBIOTICO: 'bg-red-100 text-red-800',
      ANTIPARASITARIO: 'bg-green-100 text-green-800',
      VITAMINA: 'bg-yellow-100 text-yellow-800',
      SUPLEMENTO: 'bg-purple-100 text-purple-800',
      OTRO: 'bg-gray-100 text-gray-800',
    };
    return colors[tipo] || colors.OTRO;
  };

  // Función para obtener color del stock
  const getStockColor = (actual: number, minimo: number) => {
    const porcentaje = (actual / minimo) * 100;
    if (actual === 0) return 'text-red-600 font-bold';
    if (porcentaje <= 50) return 'text-red-600';
    if (porcentaje <= 100) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Función para obtener color de alerta
  const getAlertaColor = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'MEDIA':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'BAJA':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                  <span className="text-5xl">💊</span>
                </div>
                <div className="text-white">
                  <h2 className="text-4xl font-black mb-2">Inventario de Medicamentos</h2>
                  <p className="text-white/90 text-lg font-semibold">
                    Gestión de medicamentos y alertas de stock
                  </p>
                </div>
              </div>
              <button 
                onClick={handleCreate}
                className="group relative bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-white/95 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>Nuevo Medicamento</span>
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas - Modernizadas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-10 -mt-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Total Medicamentos</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalMedicamentos}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-100 to-transparent rounded-full -mr-10 -mt-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Stock Bajo</p>
                  <p className="text-3xl font-black text-yellow-600 mt-2">{stats.stockBajo}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl shadow-lg">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-100 to-transparent rounded-full -mr-10 -mt-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Por Vencer</p>
                  <p className="text-3xl font-black text-red-600 mt-2">{stats.porVencer}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-10 -mt-10"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wide">Valor Inventario</p>
                  <p className="text-3xl font-black text-emerald-600 mt-2">
                    ${stats.valorInventario.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                  <Archive className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alertas */}
        {showAlertas && alertas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Alertas ({alertas.length})
              </h2>
              <button
                onClick={() => setShowAlertas(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {alertas.slice(0, 5).map((alerta, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${getAlertaColor(alerta.prioridad)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5" />
                      <div>
                        <p className="font-semibold">{alerta.medicamento.nombre}</p>
                        <p className="text-sm">{alerta.mensaje}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white bg-opacity-50 rounded-full text-sm font-medium">
                      {alerta.tipo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros y Búsqueda - Modernizados */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 border-gray-100 animate-fade-in">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Buscar medicamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium shadow-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold shadow-sm bg-white"
                >
                  <option value="">Todos los tipos</option>
                  <option value="VACUNA">Vacunas</option>
                  <option value="ANTIBIOTICO">Antibióticos</option>
                  <option value="ANTIPARASITARIO">Antiparasitarios</option>
                  <option value="VITAMINA">Vitaminas</option>
                  <option value="SUPLEMENTO">Suplementos</option>
                  <option value="OTRO">Otros</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Medicamentos - Modernizada */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 border-gray-100 animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-emerald-100 to-teal-100">
                  <th className="px-6 py-4 text-left text-sm font-black text-emerald-900 uppercase tracking-wide">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-emerald-900 uppercase tracking-wide">Tipo</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-emerald-900 uppercase tracking-wide">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-emerald-900 uppercase tracking-wide">Dosis</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-emerald-900 uppercase tracking-wide">Vencimiento</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-emerald-900 uppercase tracking-wide">Ubicación</th>
                  <th className="px-6 py-4 text-right text-sm font-black text-emerald-900 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMedicamentos.map((med) => (
                  <tr key={med.id} className="hover:bg-gradient-to-r hover:from-emerald-50/20 hover:to-transparent transition-all duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-black text-gray-900">{med.nombre}</p>
                        {med.fabricante && (
                          <p className="text-sm font-medium text-gray-500">{med.fabricante}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black ${getTipoBadgeColor(med.tipo)} border-2 shadow-sm`}>
                        {med.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-semibold ${getStockColor(med.stockActual, med.stockMinimo)}`}>
                          {med.stockActual} {med.unidadMedida}
                        </p>
                        <p className="text-sm text-gray-500">Mín: {med.stockMinimo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <p className="text-sm">{med.dosis}</p>
                      <p className="text-xs text-gray-500">{med.viaAdministracion}</p>
                    </td>
                    <td className="px-6 py-4">
                      {med.fechaVencimiento ? (
                        <p className="text-sm text-gray-700">
                          {new Date(med.fechaVencimiento).toLocaleDateString('es-CO')}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">N/A</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {med.ubicacionAlmacen || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenStockIncrement(med)}
                          className="group p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all hover:scale-110 border-2 border-transparent hover:border-emerald-200 hover:shadow-md"
                          title="Incrementar stock"
                        >
                          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleOpenStockDecrement(med)}
                          className="group p-2.5 text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all hover:scale-110 border-2 border-transparent hover:border-yellow-200 hover:shadow-md"
                          title="Decrementar stock"
                        >
                          <MinusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleEdit(med)}
                          className="group p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110 border-2 border-transparent hover:border-blue-200 hover:shadow-md"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="group p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110 border-2 border-transparent hover:border-red-200 hover:shadow-md"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMedicamentos.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-white">
                <span className="text-7xl">💊</span>
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-900">No hay medicamentos registrados</h3>
              <p className="text-base text-gray-600 font-medium">No se encontraron medicamentos en el inventario</p>
            </div>
          )}
        </div>

        {/* Modal de Medicamento */}
        <MedicamentoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveMedicamento}
          medicamento={selectedMedicamento}
        />

        {/* Modal de Ajuste de Stock */}
        <StockAdjustmentModal
          isOpen={isStockModalOpen}
          onClose={handleCloseStockModal}
          onSave={handleSaveStockAdjustment}
          medicamento={stockMedicamento}
        />
        </div>
      </div>
      </Layout>
  );
}
