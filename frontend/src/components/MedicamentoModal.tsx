import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Medicamento, CreateMedicamentoData, TipoMedicamento } from '../types';

interface MedicamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateMedicamentoData) => Promise<void>;
  medicamento?: Medicamento;
}

export default function MedicamentoModal({
  isOpen,
  onClose,
  onSave,
  medicamento,
}: MedicamentoModalProps) {
  const [formData, setFormData] = useState<CreateMedicamentoData>({
    nombre: '',
    tipo: 'OTRO',
    descripcion: '',
    dosis: '',
    viaAdministracion: '',
    fabricante: '',
    lote: '',
    fechaVencimiento: '',
    stockActual: 0,
    stockMinimo: 0,
    unidadMedida: '',
    precioUnitario: 0,
    ubicacionAlmacen: '',
    condicionesAlmacenamiento: '',
    notas: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medicamento) {
      setFormData({
        nombre: medicamento.nombre,
        tipo: medicamento.tipo,
        descripcion: medicamento.descripcion || '',
        dosis: medicamento.dosis,
        viaAdministracion: medicamento.viaAdministracion,
        fabricante: medicamento.fabricante || '',
        lote: medicamento.lote || '',
        fechaVencimiento: medicamento.fechaVencimiento 
          ? new Date(medicamento.fechaVencimiento).toISOString().split('T')[0]
          : '',
        stockActual: medicamento.stockActual,
        stockMinimo: medicamento.stockMinimo,
        unidadMedida: medicamento.unidadMedida,
        precioUnitario: medicamento.precioUnitario || 0,
        ubicacionAlmacen: medicamento.ubicacionAlmacen || '',
        condicionesAlmacenamiento: medicamento.condicionesAlmacenamiento || '',
        notas: medicamento.notas || '',
      });
    } else {
      // Reset form for new medicamento
      setFormData({
        nombre: '',
        tipo: 'OTRO',
        descripcion: '',
        dosis: '',
        viaAdministracion: '',
        fabricante: '',
        lote: '',
        fechaVencimiento: '',
        stockActual: 0,
        stockMinimo: 0,
        unidadMedida: '',
        precioUnitario: 0,
        ubicacionAlmacen: '',
        condicionesAlmacenamiento: '',
        notas: '',
      });
    }
  }, [medicamento, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar medicamento:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {medicamento ? 'Editar Medicamento' : 'Nuevo Medicamento'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Información Básica */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Básica</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Medicamento *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ej: Ivermectina 1%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoMedicamento })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="VACUNA">Vacuna</option>
                <option value="ANTIBIOTICO">Antibiótico</option>
                <option value="ANTIPARASITARIO">Antiparasitario</option>
                <option value="VITAMINA">Vitamina</option>
                <option value="SUPLEMENTO">Suplemento</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Descripción del medicamento..."
              />
            </div>

            {/* Administración */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4">Administración</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosis *
              </label>
              <input
                type="text"
                required
                value={formData.dosis}
                onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ej: 1ml por 50kg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vía de Administración *
              </label>
              <input
                type="text"
                required
                value={formData.viaAdministracion}
                onChange={(e) => setFormData({ ...formData, viaAdministracion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ej: Subcutánea, Oral, Intramuscular"
              />
            </div>

            {/* Información del Producto */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4">Información del Producto</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fabricante
              </label>
              <input
                type="text"
                value={formData.fabricante}
                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nombre del fabricante"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lote
              </label>
              <input
                type="text"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Número de lote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Inventario */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4">Inventario</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Actual *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.stockActual}
                onChange={(e) => setFormData({ ...formData, stockActual: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidad de Medida *
              </label>
              <input
                type="text"
                required
                value={formData.unidadMedida}
                onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ej: ml, tabletas, frascos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Unitario
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.precioUnitario}
                onChange={(e) => setFormData({ ...formData, precioUnitario: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Almacenamiento */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4">Almacenamiento</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación en Almacén
              </label>
              <input
                type="text"
                value={formData.ubicacionAlmacen}
                onChange={(e) => setFormData({ ...formData, ubicacionAlmacen: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ej: Estante A-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condiciones de Almacenamiento
              </label>
              <input
                type="text"
                value={formData.condicionesAlmacenamiento}
                onChange={(e) => setFormData({ ...formData, condicionesAlmacenamiento: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ej: Refrigeración 2-8°C"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Notas adicionales..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : medicamento ? 'Actualizar' : 'Crear Medicamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
