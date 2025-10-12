import { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Heart } from 'lucide-react';
import type { CreateMontaData, Goat } from '../types';
import goatService from '../services/goat.service';

interface MontaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateMontaData) => Promise<void>;
}

export default function MontaModal({ isOpen, onClose, onSave }: MontaModalProps) {
  const [saving, setSaving] = useState(false);
  const [hembras, setHembras] = useState<Goat[]>([]);
  const [machos, setMachos] = useState<Goat[]>([]);
  const [formData, setFormData] = useState<CreateMontaData>({
    hembraId: '',
    machoId: '',
    fechaMonta: new Date().toISOString().split('T')[0],
    observaciones: '',
  });

  // Cargar cabras al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadGoats();
    }
  }, [isOpen]);

  const loadGoats = async () => {
    try {
      const allGoats = await goatService.getAll();
      
      // Filtrar hembras y machos
      const hembrasData = allGoats.filter(goat => goat.sex === 'FEMALE' && goat.status === 'ACTIVE');
      const machosData = allGoats.filter(goat => goat.sex === 'MALE' && goat.status === 'ACTIVE');
      
      setHembras(hembrasData);
      setMachos(machosData);
    } catch (error) {
      console.error('Error al cargar cabras:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hembraId || !formData.machoId || !formData.fechaMonta) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Error al guardar monta:', error);
      alert('Error al guardar la monta. Por favor intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      hembraId: '',
      machoId: '',
      fechaMonta: new Date().toISOString().split('T')[0],
      observaciones: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  // Calcular fecha estimada de parto (fecha monta + 150 días)
  const calcularFechaParto = () => {
    if (!formData.fechaMonta) return '';
    const fechaMonta = new Date(formData.fechaMonta);
    fechaMonta.setDate(fechaMonta.getDate() + 150);
    return fechaMonta.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-rose-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">Registrar Monta</h2>
                <p className="text-pink-100 text-sm">Ingresa los detalles del evento de monta</p>
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
          {/* Alerta informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Periodo de gestación: 150 días</p>
              <p className="text-blue-700">El sistema calculará automáticamente la fecha estimada de parto.</p>
            </div>
          </div>

          {/* Información de la Monta */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              Información de la Monta
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hembra */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hembra <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.hembraId}
                  onChange={(e) => setFormData({ ...formData, hembraId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                >
                  <option value="">Selecciona una hembra</option>
                  {hembras.map((hembra) => (
                    <option key={hembra.id} value={hembra.id}>
                      {hembra.customId} {hembra.name ? `- ${hembra.name}` : ''} ({hembra.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Macho */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Macho <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.machoId}
                  onChange={(e) => setFormData({ ...formData, machoId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                >
                  <option value="">Selecciona un macho</option>
                  {machos.map((macho) => (
                    <option key={macho.id} value={macho.id}>
                      {macho.customId} {macho.name ? `- ${macho.name}` : ''} ({macho.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha de Monta */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Monta <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fechaMonta}
                  onChange={(e) => setFormData({ ...formData, fechaMonta: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                />
              </div>

              {/* Fecha Estimada de Parto (calculada) */}
              {formData.fechaMonta && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha Estimada de Parto
                  </label>
                  <div className="w-full px-4 py-3 bg-pink-50 border-2 border-pink-200 rounded-xl text-pink-800 font-bold">
                    {calcularFechaParto()}
                  </div>
                </div>
              )}
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={3}
                placeholder="Escribe cualquier observación sobre esta monta..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all resize-none"
              />
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
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {saving ? 'Guardando...' : 'Registrar Monta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
