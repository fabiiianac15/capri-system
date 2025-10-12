import { useState } from 'react';
import { X, Baby, AlertCircle, CheckCircle } from 'lucide-react';
import type { RegistrarPartoData } from '../types';

interface PartoModalProps {
  isOpen: boolean;
  montaId: string;
  hembraNombre: string;
  onClose: () => void;
  onSave: (montaId: string, data: RegistrarPartoData) => Promise<void>;
}

export default function PartoModal({ isOpen, montaId, hembraNombre, onClose, onSave }: PartoModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<RegistrarPartoData>({
    fechaParto: new Date().toISOString().split('T')[0],
    totalCrias: 1,
    criasHembra: 1,
    criasMacho: 0,
    observacionesParto: '',
    complicaciones: '',
    asistenciaVeterinaria: false,
    inicioProduccionLeche: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.criasHembra + formData.criasMacho !== formData.totalCrias) {
      alert('El total de crías hembra + macho debe ser igual al total de crías');
      return;
    }

    try {
      setSaving(true);
      await onSave(montaId, formData);
      handleClose();
    } catch (error) {
      console.error('Error al registrar parto:', error);
      alert('Error al registrar el parto. Por favor intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fechaParto: new Date().toISOString().split('T')[0],
      totalCrias: 1,
      criasHembra: 1,
      criasMacho: 0,
      observacionesParto: '',
      complicaciones: '',
      asistenciaVeterinaria: false,
      inicioProduccionLeche: false,
    });
    onClose();
  };

  const handleTotalCriasChange = (value: number) => {
    setFormData({
      ...formData,
      totalCrias: value,
      criasHembra: Math.min(formData.criasHembra, value),
      criasMacho: value - Math.min(formData.criasHembra, value),
    });
  };

  const handleCriasHembraChange = (value: number) => {
    setFormData({
      ...formData,
      criasHembra: value,
      criasMacho: formData.totalCrias - value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">Registrar Parto</h2>
                <p className="text-emerald-100 text-sm">
                  Hembra: <span className="font-semibold">{hembraNombre}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Parto */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Baby className="w-5 h-5 text-emerald-600" />
              Información del Parto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de Parto */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha del Parto <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fechaParto}
                  onChange={(e) => setFormData({ ...formData, fechaParto: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              {/* Total de Crías */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total de Crías <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.totalCrias}
                  onChange={(e) => handleTotalCriasChange(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              {/* Crías Hembra */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Crías Hembra <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalCrias}
                  value={formData.criasHembra}
                  onChange={(e) => handleCriasHembraChange(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-pink-300 bg-pink-50 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all font-bold text-pink-700"
                  required
                />
              </div>

              {/* Crías Macho (calculado) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Crías Macho (calculado automáticamente)
                </label>
                <div className="w-full px-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-xl font-bold text-blue-700">
                  {formData.criasMacho} {formData.criasMacho === 1 ? 'cría' : 'crías'}
                </div>
              </div>
            </div>
          </div>

          {/* Complicaciones y Observaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Información Adicional
            </h3>

            {/* Complicaciones */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complicaciones
              </label>
              <textarea
                value={formData.complicaciones || ''}
                onChange={(e) => setFormData({ ...formData, complicaciones: e.target.value })}
                rows={2}
                placeholder="Describe cualquier complicación durante el parto..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              />
            </div>

            {/* Observaciones del Parto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observaciones Generales
              </label>
              <textarea
                value={formData.observacionesParto || ''}
                onChange={(e) => setFormData({ ...formData, observacionesParto: e.target.value })}
                rows={2}
                placeholder="Escribe cualquier observación adicional sobre el parto..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="asistenciaVeterinaria"
                  checked={formData.asistenciaVeterinaria || false}
                  onChange={(e) => setFormData({ ...formData, asistenciaVeterinaria: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <label htmlFor="asistenciaVeterinaria" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  ¿Requirió asistencia veterinaria?
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="inicioProduccionLeche"
                  checked={formData.inicioProduccionLeche || false}
                  onChange={(e) => setFormData({ ...formData, inicioProduccionLeche: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <label htmlFor="inicioProduccionLeche" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  ¿Inició producción de leche?
                </label>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-bold text-emerald-900">Resumen del Parto:</p>
                <p className="text-emerald-800">
                  • Total: <span className="font-semibold">{formData.totalCrias}</span> {formData.totalCrias === 1 ? 'cría' : 'crías'}
                </p>
                <p className="text-pink-700">
                  • Hembras: <span className="font-semibold">{formData.criasHembra}</span>
                </p>
                <p className="text-blue-700">
                  • Machos: <span className="font-semibold">{formData.criasMacho}</span>
                </p>
                {formData.complicaciones && (
                  <p className="text-orange-700">
                    • <span className="font-semibold">⚠️ Con complicaciones</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {saving ? 'Guardando...' : 'Registrar Parto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
