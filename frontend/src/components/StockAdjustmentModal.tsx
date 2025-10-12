import React, { useState } from 'react';
import { X, Plus, Minus, Package } from 'lucide-react';
import type { Medicamento } from '../types';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cantidad: number, operacion: 'INCREMENTAR' | 'DECREMENTAR') => Promise<void>;
  medicamento: Medicamento | null;
}

export default function StockAdjustmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  medicamento 
}: StockAdjustmentModalProps) {
  const [cantidad, setCantidad] = useState<number>(1);
  const [operacion, setOperacion] = useState<'INCREMENTAR' | 'DECREMENTAR'>('INCREMENTAR');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicamento || cantidad <= 0) return;

    // Validar que no se decremente más del stock actual
    if (operacion === 'DECREMENTAR' && cantidad > medicamento.stockActual) {
      alert(`No puedes decrementar más de ${medicamento.stockActual} ${medicamento.unidadMedida}`);
      return;
    }

    setLoading(true);
    try {
      await onSave(cantidad, operacion);
      handleClose();
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      alert('Error al ajustar el stock');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCantidad(1);
    setOperacion('INCREMENTAR');
    setMotivo('');
    onClose();
  };

  if (!isOpen || !medicamento) return null;

  const stockResultante = operacion === 'INCREMENTAR' 
    ? medicamento.stockActual + cantidad 
    : medicamento.stockActual - cantidad;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Package className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Ajustar Stock</h2>
              <p className="text-sm text-gray-500">{medicamento.nombre}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Stock Actual */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Stock Actual</span>
              <span className="text-2xl font-bold text-gray-900">
                {medicamento.stockActual} {medicamento.unidadMedida}
              </span>
            </div>
          </div>

          {/* Operación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operación
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOperacion('INCREMENTAR')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  operacion === 'INCREMENTAR'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Plus className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm font-medium">Incrementar</span>
              </button>
              <button
                type="button"
                onClick={() => setOperacion('DECREMENTAR')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  operacion === 'DECREMENTAR'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Minus className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm font-medium">Decrementar</span>
              </button>
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max={operacion === 'DECREMENTAR' ? medicamento.stockActual : undefined}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {medicamento.unidadMedida}
              </span>
            </div>
            {operacion === 'DECREMENTAR' && cantidad > medicamento.stockActual && (
              <p className="mt-1 text-sm text-red-600">
                Cantidad mayor al stock disponible
              </p>
            )}
          </div>

          {/* Motivo (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo <span className="text-gray-400">(opcional)</span>
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              placeholder="Ej: Aplicación masiva, Vencimiento, Inventario físico..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Stock Resultante */}
          <div className={`p-4 rounded-lg border-2 ${
            stockResultante < medicamento.stockMinimo
              ? 'bg-red-50 border-red-200'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Stock Resultante</span>
              <span className={`text-2xl font-bold ${
                stockResultante < medicamento.stockMinimo
                  ? 'text-red-700'
                  : 'text-emerald-700'
              }`}>
                {stockResultante} {medicamento.unidadMedida}
              </span>
            </div>
            {stockResultante < medicamento.stockMinimo && (
              <p className="mt-2 text-sm text-red-600">
                ⚠️ El stock quedará por debajo del mínimo ({medicamento.stockMinimo} {medicamento.unidadMedida})
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || (operacion === 'DECREMENTAR' && cantidad > medicamento.stockActual)}
              className={`flex-1 px-6 py-3 rounded-xl font-medium text-white transition-all ${
                operacion === 'INCREMENTAR'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Guardando...' : operacion === 'INCREMENTAR' ? 'Incrementar' : 'Decrementar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
