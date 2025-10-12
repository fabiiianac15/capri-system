import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import goatService from '../services/goat.service';
import { generateGoatsReport } from '../utils/goatsPdfReport';
import type { Goat, GoatSex, GoatCategory, GoatStatus } from '../types/index';
import { Eye, X, Filter, Edit2, FileText, Download } from 'lucide-react';

// Pesos ideales por categoría (kg)
const IDEAL_WEIGHTS = {
  CRIA: { min: 8, max: 15, unit: 'kg' },
  LEVANTE_1: { min: 15, max: 25, unit: 'kg' },
  LEVANTE_2: { min: 25, max: 35, unit: 'kg' },
  REPRODUCTOR: { min: 45, max: 65, unit: 'kg' },
  LECHERA: { min: 35, max: 50, unit: 'kg' },
};

export default function Goats() {
  const { user } = useAuth();
  const [goats, setGoats] = useState<Goat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGoat, setSelectedGoat] = useState<Goat | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    category: '',
    sex: '',
    breed: '',
    status: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    customId: '',
    name: '',
    breed: '',
    birthDate: '',
    sex: 'FEMALE' as GoatSex,
    category: 'CRIA' as GoatCategory,
    weight: '',
    milkProduction: '',
    feedConsumption: '',
    birthCount: '',
    status: 'ACTIVE' as GoatStatus,
    motherId: '',
    fatherId: '',
    notes: ''
  });

  useEffect(() => {
    loadGoats();
  }, []);

  const loadGoats = async () => {
    try {
      setIsLoading(true);
      const data = await goatService.getAll();
      setGoats(data);
    } catch (error) {
      console.error('Error al cargar cabras:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateGoat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        customId: formData.customId,
        name: formData.name || undefined,
        breed: formData.breed,
        birthDate: formData.birthDate,
        sex: formData.sex,
        category: formData.category,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        notes: formData.notes || undefined,
      };
      await goatService.create(payload);
      setCreateOpen(false);
      resetForm();
      loadGoats();
    } catch (error) {
      console.error('Error al crear cabra:', error);
    }
  };

  const handleDeleteGoat = async () => {
    if (!selectedGoat) return;
    try {
      setIsDeleting(true);
      await goatService.delete(selectedGoat.id);
      setDeleteConfirmOpen(false);
      setSelectedGoat(null);
      loadGoats();
    } catch (error) {
      console.error('Error al eliminar cabra:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customId: '',
      name: '',
      breed: '',
      birthDate: '',
      sex: 'FEMALE' as GoatSex,
      category: 'CRIA' as GoatCategory,
      weight: '',
      milkProduction: '',
      feedConsumption: '',
      birthCount: '',
      status: 'ACTIVE' as GoatStatus,
      motherId: '',
      fatherId: '',
      notes: ''
    });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      sex: '',
      breed: '',
      status: '',
    });
  };

  const handleUpdateGoat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoat) return;
    try {
      setIsUpdating(true);
      const payload = {
        customId: formData.customId,
        name: formData.name || undefined,
        breed: formData.breed,
        birthDate: formData.birthDate,
        sex: formData.sex,
        category: formData.category,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        status: formData.status,
        motherId: formData.motherId || undefined,
        fatherId: formData.fatherId || undefined,
        notes: formData.notes || undefined,
      };
      await goatService.update(selectedGoat.id, payload);
      setEditOpen(false);
      setSelectedGoat(null);
      resetForm();
      loadGoats();
    } catch (error) {
      console.error('Error al actualizar cabra:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditDialog = (goat: Goat) => {
    setSelectedGoat(goat);
    setFormData({
      customId: goat.customId,
      name: goat.name || '',
      breed: goat.breed,
      birthDate: goat.birthDate.split('T')[0],
      sex: goat.sex as GoatSex,
      category: goat.category as GoatCategory,
      weight: goat.weight?.toString() || '',
      milkProduction: goat.milkProduction?.toString() || '',
      feedConsumption: goat.feedConsumption?.toString() || '',
      birthCount: goat.birthCount?.toString() || '',
      status: goat.status as GoatStatus,
      motherId: goat.motherId || '',
      fatherId: goat.fatherId || '',
      notes: goat.notes || ''
    });
    setEditOpen(true);
  };

  // Filtrado y búsqueda mejorado
  const filteredGoats = goats.filter(goat => {
    const matchesSearch = 
      goat.customId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      goat.breed.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || goat.category === filters.category;
    const matchesSex = !filters.sex || goat.sex === filters.sex;
    const matchesBreed = !filters.breed || goat.breed === filters.breed;
    const matchesStatus = !filters.status || goat.status === filters.status;

    return matchesSearch && matchesCategory && matchesSex && matchesBreed && matchesStatus;
  });

  const getWeightStatus = (weight: number | undefined, category: GoatCategory) => {
    if (!weight) return { status: 'unknown', color: 'gray' };
    const ideal = IDEAL_WEIGHTS[category];
    if (weight < ideal.min) return { status: 'bajo', color: 'red' };
    if (weight > ideal.max) return { status: 'alto', color: 'orange' };
    return { status: 'ideal', color: 'green' };
  };

  const uniqueBreeds = Array.from(new Set(goats.map(g => g.breed))).sort();

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return years > 0 ? `${years}a ${months}m` : `${months}m`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="h-12 w-12 animate-spin text-[#6b7c45]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-medium text-[#6b7c45]">Cargando datos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header Card - Modernizado */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg mb-6 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e02] via-[#2a4a04] to-[#4a7c0b]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                    <span className="text-5xl">🐐</span>
                  </div>
                  <div className="text-white">
                    <h2 className="text-4xl font-black mb-2">Gestión de Cabras</h2>
                    <p className="text-white/90 text-lg font-semibold">
                      {filteredGoats.length} de {goats.length} cabras registradas
                      {Object.values(filters).some(v => v) && ' (filtradas)'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => generateGoatsReport(filteredGoats, user?.name || 'Usuario')}
                    className="group relative bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 border border-white/30 hover:scale-105"
                    title="Generar reporte PDF"
                  >
                    <FileText className="w-5 h-5" />
                    <Download className="w-4 h-4" />
                    <span>Exportar PDF</span>
                  </button>
                  <button
                    onClick={() => setCreateOpen(true)}
                    className="group relative bg-white text-[#2a4a04] px-6 py-3 rounded-xl font-bold hover:bg-white/95 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
                  >
                    <span className="text-xl">+</span>
                    <span>Agregar Cabra</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search - Modernizado */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 border-gray-100 animate-fade-in mb-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#e8f0d8] to-transparent rounded-full -mr-20 -mt-20"></div>
            
            {/* Search and Actions */}
            <div className="relative p-6">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[250px]">
                  <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Buscar por ID, nombre o raza..."
                    className="pl-10 h-11 px-4 py-2 w-full border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`px-6 py-2.5 border-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    Object.values(filters).some(v => v)
                      ? 'bg-gradient-to-r from-[#4a7c0b] to-[#6b7c45] text-white border-[#4a7c0b]'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <Filter className="h-5 w-5" />
                  <span>Filtros</span>
                  {Object.values(filters).some(v => v) && (
                    <span className="ml-1 px-2.5 py-0.5 bg-white/30 rounded-full text-xs font-black">
                      {Object.values(filters).filter(v => v).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filters Panel */}
              {filtersOpen && (
                <div className="mt-6 p-5 bg-gradient-to-br from-[#e8f0d8] to-[#d3dbb8] rounded-xl border-2 border-[#c0e09c] grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-black text-[#1a2e02] mb-2">Categoría</label>
                    <select
                      className="w-full h-10 px-3 py-2 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value="">Todas</option>
                      <option value="CRIA">CRIA</option>
                      <option value="LEVANTE_1">LEVANTE_1</option>
                      <option value="LEVANTE_2">LEVANTE_2</option>
                      <option value="REPRODUCTOR">REPRODUCTOR</option>
                      <option value="LECHERA">LECHERA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-[#1a2e02] mb-2">Sexo</label>
                    <select
                      className="w-full h-10 px-3 py-2 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white"
                      value={filters.sex}
                      onChange={(e) => setFilters({ ...filters, sex: e.target.value })}
                    >
                      <option value="">Todos</option>
                      <option value="FEMALE">Hembra</option>
                      <option value="MALE">Macho</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-[#1a2e02] mb-2">Raza</label>
                    <select
                      className="w-full h-10 px-3 py-2 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white"
                      value={filters.breed}
                      onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
                    >
                      <option value="">Todas</option>
                      {uniqueBreeds.map(breed => (
                        <option key={breed} value={breed}>{breed}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-[#1a2e02] mb-2">Estado</label>
                    <select
                      className="w-full h-10 px-3 py-2 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="">Todos</option>
                      <option value="ACTIVE">Activo</option>
                      <option value="SOLD">Vendido</option>
                      <option value="DECEASED">Fallecido</option>
                    </select>
                  </div>

                  <div className="md:col-span-4 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-5 py-2 text-sm text-[#2a4a04] hover:text-[#1a2e02] font-black hover:bg-white/50 rounded-lg transition-all"
                    >
                      Limpiar filtros ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions Bar + Table Card - Modernizado */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 border-gray-100 animate-fade-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#e8f0d8]/40 to-transparent rounded-full -mr-32 -mt-32"></div>
            
            {/* Table */}
            <div className="relative overflow-x-auto">
              {filteredGoats.length === 0 ? (
                <div className="flex h-[400px] items-center justify-center">
                  <div className="text-center animate-fade-in">
                    <div className="bg-gradient-to-br from-[#e8f0d8] to-[#d3dbb8] w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-white">
                      <span className="text-7xl">🐐</span>
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-[#1a2e02]">No hay cabras registradas</h3>
                    <p className="text-base text-gray-600 mb-6 font-medium">No se encontraron registros. Agrega la primera cabra al sistema.</p>
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="group px-6 py-3 bg-gradient-to-r from-[#2a4a04] to-[#4a7c0b] hover:from-[#1a2e02] hover:to-[#2a4a04] text-white rounded-xl font-black text-base transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <span className="text-xl">+</span>
                      <span>Agregar Primera Cabra</span>
                    </button>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-[#e8f0d8] to-[#d3dbb8]">
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">ID</th>
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">Nombre</th>
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">Raza</th>
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">Edad</th>
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">Sexo</th>
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">Tipo</th>
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">Peso</th>
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">Producción</th>
                      <th className="px-4 py-4 text-left text-sm font-black text-[#1a2e02]">Estado</th>
                      <th className="px-4 py-4 text-right text-sm font-black text-[#1a2e02]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGoats.map((goat) => (
                      <tr key={goat.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-[#e8f0d8]/20 hover:to-transparent transition-all duration-200">
                        <td className="px-4 py-4 text-sm font-black text-gray-900">{goat.customId}</td>
                        <td className="px-4 py-4 text-sm font-bold text-gray-700">{goat.name || '-'}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700">{goat.breed}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700">{calculateAge(goat.birthDate)}</td>
                        <td className="px-4 py-4 text-sm">
                          {goat.sex === 'FEMALE' ? (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 text-xs font-black border-2 border-pink-200 shadow-sm">
                              ♀️ Hembra
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-black border-2 border-blue-200 shadow-sm">
                              ♂️ Macho
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {goat.category === 'LECHERA' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-black border-2 border-blue-200 shadow-sm">
                              LECHERA
                            </span>
                          )}
                          {goat.category === 'REPRODUCTOR' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 text-xs font-black border-2 border-purple-200 shadow-sm">
                              REPRODUCTOR
                            </span>
                          )}
                          {goat.category === 'CRIA' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs font-black border-2 border-gray-200 shadow-sm">
                              CRIA
                            </span>
                          )}
                          {!['LECHERA', 'REPRODUCTOR', 'CRIA'].includes(goat.category) && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs font-black border-2 border-gray-200 shadow-sm">
                              {goat.category}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700">{goat.weight ? `${goat.weight}kg` : '-'}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700">{goat.milkProduction}L</td>
                        <td className="px-4 py-4 text-sm">
                          {goat.status === 'ACTIVE' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-green-50 to-green-100 text-green-700 text-xs font-black border-2 border-green-200 shadow-sm">
                              ✓ Activo
                            </span>
                          )}
                          {goat.status === 'SOLD' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-xs font-black border-2 border-red-200 shadow-sm">
                              Vendido
                            </span>
                          )}
                          {goat.status === 'DECEASED' && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-black border-2 border-gray-800 shadow-sm">
                              † Fallecido
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedGoat(goat);
                                setDetailsOpen(true);
                              }}
                              className="group p-2.5 hover:bg-blue-50 rounded-xl transition-all hover:scale-110 border-2 border-transparent hover:border-blue-200 hover:shadow-md"
                              title="Ver detalles"
                            >
                              <Eye className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
                            </button>
                            <button
                              onClick={() => openEditDialog(goat)}
                              className="group p-2.5 hover:bg-gray-50 rounded-xl transition-all hover:scale-110 border-2 border-transparent hover:border-gray-300 hover:shadow-md"
                              title="Editar"
                            >
                              <Edit2 className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedGoat(goat);
                                setDeleteConfirmOpen(true);
                              }}
                              className="group p-2.5 hover:bg-red-50 rounded-xl transition-all hover:scale-110 border-2 border-transparent hover:border-red-200 hover:shadow-md"
                              title="Eliminar"
                            >
                              <svg className="h-5 w-5 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE DIALOG */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Nueva Cabra</h3>
              <p className="text-sm text-gray-500 mt-1">Completa la información de la cabra</p>
            </div>

            <form onSubmit={handleCreateGoat} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ID de Cabra *</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45]"
                    placeholder="Ej: 218-344"
                    value={formData.customId}
                    onChange={(e) => setFormData({ ...formData, customId: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45]"
                    placeholder="Nombre de la cabra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Raza *</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45]"
                    placeholder="Ej: Saanen, Alpine"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45]"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sexo *</label>
                  <select
                    className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45]"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as GoatSex })}
                    required
                  >
                    <option value="FEMALE">Hembra</option>
                    <option value="MALE">Macho</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Categoría *</label>
                  <select
                    className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45]"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as GoatCategory })}
                    required
                  >
                    <option value="CRIA">CRIA</option>
                    <option value="LEVANTE_1">LEVANTE_1</option>
                    <option value="LEVANTE_2">LEVANTE_2</option>
                    <option value="REPRODUCTOR">REPRODUCTOR</option>
                    <option value="LECHERA">LECHERA</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45]"
                    placeholder="0.0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Estado *</label>
                  <select
                    className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45]"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as GoatStatus })}
                    required
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="SOLD">Vendido</option>
                    <option value="DECEASED">Fallecido</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Notas</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6b7c45] focus:border-[#6b7c45] resize-none"
                    placeholder="Información adicional..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a2e02] hover:bg-[#2a4a04] text-white rounded-md font-semibold text-sm transition-all duration-300"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {detailsOpen && selectedGoat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Detalles de la Cabra</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedGoat.customId}</p>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información General */}
              <div className="bg-gradient-to-r from-[#6b7c45]/10 to-[#6b7c45]/5 p-6 rounded-lg border border-[#6b7c45]/20">
                <h4 className="text-lg font-semibold text-[#1a2e02] mb-4 flex items-center gap-2">
                  <span>📋</span> Información General
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900">{selectedGoat.name || 'Sin nombre'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID (Madre-Cría)</p>
                    <p className="font-medium text-gray-900 font-mono">{selectedGoat.customId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Raza</p>
                    <p className="font-medium text-gray-900">{selectedGoat.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Edad</p>
                    <p className="font-medium text-gray-900">{calculateAge(selectedGoat.birthDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sexo</p>
                    <p className="font-medium text-gray-900">{selectedGoat.sex === 'FEMALE' ? '♀️ Hembra' : '♂️ Macho'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Categoría</p>
                    <p className="font-medium text-gray-900">{selectedGoat.category}</p>
                  </div>
                </div>
              </div>

              {/* Métricas Físicas */}
              <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <span>⚖️</span> Métricas Físicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Peso Actual</p>
                    <p className="font-medium text-gray-900 text-lg">{selectedGoat.weight ? `${selectedGoat.weight} kg` : 'No registrado'}</p>
                    {selectedGoat.weight && (
                      <p className={`text-xs mt-1 ${
                        getWeightStatus(selectedGoat.weight, selectedGoat.category as GoatCategory).status === 'ideal' ? 'text-green-600' :
                        getWeightStatus(selectedGoat.weight, selectedGoat.category as GoatCategory).status === 'bajo' ? 'text-red-600' :
                        'text-orange-600'
                      }`}>
                        {getWeightStatus(selectedGoat.weight, selectedGoat.category as GoatCategory).status === 'ideal' ? '✓ Peso ideal' :
                         getWeightStatus(selectedGoat.weight, selectedGoat.category as GoatCategory).status === 'bajo' ? '⚠ Bajo peso' :
                         '⚠ Sobre peso'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rango Ideal ({selectedGoat.category})</p>
                    <p className="font-medium text-gray-900 text-lg">
                      {IDEAL_WEIGHTS[selectedGoat.category as GoatCategory].min} - {IDEAL_WEIGHTS[selectedGoat.category as GoatCategory].max} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Producción de Leche</p>
                    <p className="font-medium text-gray-900 text-lg">{selectedGoat.milkProduction || 0} L/día</p>
                  </div>
                </div>
              </div>

              {/* Genealogía */}
              <div className="bg-purple-50/50 p-6 rounded-lg border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <span>🧬</span> Genealogía
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Madre (ID)</p>
                    <p className="font-medium text-gray-900 font-mono">{selectedGoat.motherId || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Padre (ID)</p>
                    <p className="font-medium text-gray-900 font-mono">{selectedGoat.fatherId || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Crías</p>
                    <p className="font-medium text-gray-900">{selectedGoat.birthCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* Estado y Notas */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📝</span> Información Adicional
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-medium text-gray-900">
                      {selectedGoat.status === 'ACTIVE' ? '🟢 Activo' : selectedGoat.status === 'SOLD' ? '🔴 Vendido' : '⚫ Fallecido'}
                    </p>
                  </div>
                  {selectedGoat.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notas</p>
                      <p className="font-medium text-gray-900 whitespace-pre-wrap">{selectedGoat.notes}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Registro</p>
                    <p className="font-medium text-gray-900">{new Date(selectedGoat.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDetailsOpen(false);
                  openEditDialog(selectedGoat);
                }}
                className="px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md font-semibold text-sm transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => setDetailsOpen(false)}
                className="px-6 py-2 bg-[#1a2e02] hover:bg-[#2a4a04] text-white rounded-md font-semibold text-sm transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md m-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Estás seguro?</h3>
              <p className="text-sm text-gray-500">
                Esta acción no se puede deshacer. Se eliminará permanentemente la cabra <strong>{selectedGoat?.customId}</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setSelectedGoat(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium text-sm transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteGoat}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold text-sm transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editOpen && selectedGoat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-gray-900">Editar Cabra: {selectedGoat.customId}</h3>
              <button
                onClick={() => {
                  setEditOpen(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGoat} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Básica */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Información Básica</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID (Madre-Cría) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customId"
                    value={formData.customId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raza <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="MALE">Macho</option>
                    <option value="FEMALE">Hembra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="CRIA">CRIA</option>
                    <option value="LEVANTE_1">LEVANTE_1</option>
                    <option value="LEVANTE_2">LEVANTE_2</option>
                    <option value="REPRODUCTOR">REPRODUCTOR</option>
                    <option value="LECHERA">LECHERA</option>
                  </select>
                </div>

                {/* Métricas Físicas */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Métricas Físicas</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producción de Leche (L/día)
                  </label>
                  <input
                    type="number"
                    name="milkProduction"
                    value={formData.milkProduction}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                {/* Genealogía */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Genealogía</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Madre (opcional)
                  </label>
                  <input
                    type="text"
                    name="motherId"
                    value={formData.motherId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] font-mono"
                    placeholder="Ej: A001-C003"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Padre (opcional)
                  </label>
                  <input
                    type="text"
                    name="fatherId"
                    value={formData.fatherId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] font-mono"
                    placeholder="Ej: B002"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total de Crías
                  </label>
                  <input
                    type="number"
                    name="birthCount"
                    value={formData.birthCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                {/* Estado */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Estado y Notas</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                    required
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="SOLD">Vendido</option>
                    <option value="DECEASED">Fallecido</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                    placeholder="Observaciones, tratamientos, etc."
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white pt-6 mt-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditOpen(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md font-semibold text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-[#1a2e02] hover:bg-[#2a4a04] text-white rounded-md font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    'Actualizar Cabra'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
