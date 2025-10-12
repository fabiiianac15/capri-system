import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { supplierService } from '../services/supplier.service';
import type {
  Supplier,
  Country,
  State,
  City
} from '../services/supplier.service';
import { Eye, X, Filter, Edit2, Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Datos de ubicación
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Filtros
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    city: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nit: '',
    phone: '',
    email: '',
    address: '',
    countryId: '',
    stateId: '',
    cityId: ''
  });

  useEffect(() => {
    loadSuppliers();
    loadCountries();
  }, []);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const data = await supplierService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error al cargar países:', error);
    }
  };

  const handleCountryChange = async (countryId: string, isFilter = false) => {
    if (isFilter) {
      setFilters(prev => ({ ...prev, country: countryId, state: '', city: '' }));
    } else {
      setFormData(prev => ({ ...prev, countryId, stateId: '', cityId: '' }));
    }

    if (countryId) {
      try {
        const statesData = await supplierService.getStatesByCountry(countryId);
        setStates(statesData);
        setCities([]);
      } catch (error) {
        console.error('Error al cargar departamentos:', error);
      }
    } else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = async (stateId: string, isFilter = false) => {
    if (isFilter) {
      setFilters(prev => ({ ...prev, state: stateId, city: '' }));
    } else {
      setFormData(prev => ({ ...prev, stateId, cityId: '' }));
    }

    if (stateId) {
      try {
        const citiesData = await supplierService.getCitiesByState(stateId);
        setCities(citiesData);
      } catch (error) {
        console.error('Error al cargar ciudades:', error);
      }
    } else {
      setCities([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supplierService.create({
        name: formData.name,
        nit: formData.nit || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
        cityId: formData.cityId || undefined
      });
      setCreateOpen(false);
      resetForm();
      loadSuppliers();
    } catch (error) {
      console.error('Error al crear proveedor:', error);
    }
  };

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      setIsUpdating(true);
      await supplierService.update(selectedSupplier.id, {
        name: formData.name,
        nit: formData.nit || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
        cityId: formData.cityId || undefined
      });
      setEditOpen(false);
      setSelectedSupplier(null);
      resetForm();
      loadSuppliers();
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditDialog = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      nit: supplier.nit || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      countryId: supplier.city?.state?.country?.id || '',
      stateId: supplier.city?.state?.id || '',
      cityId: supplier.cityId || ''
    });

    // Cargar states y ciudades para el país/state actual
    if (supplier.city?.state?.country?.id) {
      const statesData = await supplierService.getStatesByCountry(supplier.city.state.country.id);
      setStates(statesData);
      
      if (supplier.city?.state?.id) {
        const citiesData = await supplierService.getCitiesByState(supplier.city.state.id);
        setCities(citiesData);
      }
    }

    setEditOpen(true);
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;
    try {
      setIsDeleting(true);
      await supplierService.delete(selectedSupplier.id);
      setDeleteConfirmOpen(false);
      setSelectedSupplier(null);
      loadSuppliers();
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nit: '',
      phone: '',
      email: '',
      address: '',
      countryId: '',
      stateId: '',
      cityId: ''
    });
    setStates([]);
    setCities([]);
  };

  const resetFilters = () => {
    setFilters({ country: '', state: '', city: '' });
  };

  // Filtrado
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.nit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      '';

    const matchesCountry = !filters.country || supplier.city?.state?.country?.id === filters.country;
    const matchesState = !filters.state || supplier.city?.state?.id === filters.state;
    const matchesCity = !filters.city || supplier.cityId === filters.city;

    return matchesSearch && matchesCountry && matchesState && matchesCity;
  });

  const activeFiltersCount = [filters.country, filters.state, filters.city].filter(Boolean).length;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b7c45] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando proveedores...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* HEADER - Modernizado */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e02] via-[#2a4a04] to-[#4a7c0b]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                  <span className="text-5xl">🏢</span>
                </div>
                <div className="text-white">
                  <h2 className="text-4xl font-black mb-2">Proveedores</h2>
                  <p className="text-white/90 text-lg font-semibold">
                    {filteredSuppliers.length} de {suppliers.length} proveedores registrados
                    {activeFiltersCount > 0 && ` • ${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`group relative px-6 py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl flex items-center gap-2 border-2 ${
                    filtersOpen
                      ? 'bg-white text-[#2a4a04] border-white'
                      : 'bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 hover:border-white/50'
                  }`}
                >
                  <Filter className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setCreateOpen(true)}
                  className="group px-6 py-3 bg-white text-[#2a4a04] hover:text-[#1a2e02] rounded-xl transition-all font-black shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
                >
                  <Building2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Agregar Proveedor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR - Modernizado */}
        <div className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#e8f0d8]/60 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, NIT o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-14 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] transition-all font-medium shadow-sm"
            />
            <svg
              className="absolute left-4 top-3.5 h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* FILTERS PANEL - Modernizado */}
        {filtersOpen && (
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border-2 border-[#c0e09c] animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a7c0b] via-[#6b7c45] to-[#4a7c0b]"></div>
            <div className="flex items-center justify-between mb-6 mt-2">
              <h3 className="font-black text-xl text-[#1a2e02] flex items-center gap-2">
                <Filter className="w-6 h-6" />
                Filtros Avanzados
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-[#2a4a04] hover:text-[#1a2e02] font-black hover:bg-[#e8f0d8] px-4 py-2 rounded-lg transition-all"
              >
                Limpiar filtros ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <select
                  value={filters.country}
                  onChange={(e) => handleCountryChange(e.target.value, true)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                >
                  <option value="">Todos</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departamento/Estado</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleStateChange(e.target.value, true)}
                  disabled={!filters.country}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] disabled:bg-gray-100"
                >
                  <option value="">Todos</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!filters.state}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] disabled:bg-gray-100"
                >
                  <option value="">Todas</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#6b7c45]/10 p-2 rounded-lg">
                          <Building2 className="h-5 w-5 text-[#6b7c45]" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{supplier.name}</div>
                          {supplier.email && (
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3" />
                              {supplier.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900">{supplier.nit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {supplier.phone ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          {supplier.phone}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No registrado</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <div>{supplier.city?.name}</div>
                          <div className="text-xs text-gray-500">
                            {supplier.city?.state?.name}, {supplier.city?.state?.country?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {supplier.products?.length || 0} producto{supplier.products?.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setDetailsOpen(true);
                          }}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditDialog(supplier)}
                          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No se encontraron proveedores</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-gray-900">Nuevo Proveedor</h3>
              <button
                onClick={() => {
                  setCreateOpen(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nit"
                    value={formData.nit}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.countryId}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  >
                    <option value="">Seleccionar...</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento/Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.stateId}
                    onChange={(e) => handleStateChange(e.target.value)}
                    disabled={!formData.countryId}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar...</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    disabled={!formData.stateId}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar...</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md font-semibold text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1a2e02] hover:bg-[#2a4a04] text-white rounded-md font-semibold text-sm transition-all"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {detailsOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Detalles del Proveedor</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedSupplier.name}</p>
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
                  <Building2 className="h-5 w-5" /> Información de la Empresa
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900">{selectedSupplier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIT</p>
                    <p className="font-medium text-gray-900 font-mono">{selectedSupplier.nit || 'No registrado'}</p>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" /> Información de Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium text-gray-900">{selectedSupplier.phone || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedSupplier.email || 'No registrado'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium text-gray-900">{selectedSupplier.address || 'No registrada'}</p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-purple-50/50 p-6 rounded-lg border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Ubicación
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">País</p>
                    <p className="font-medium text-gray-900">{selectedSupplier.city?.state?.country?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Departamento/Estado</p>
                    <p className="font-medium text-gray-900">{selectedSupplier.city?.state?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ciudad</p>
                    <p className="font-medium text-gray-900">{selectedSupplier.city?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📦 Productos Suministrados</h4>
                {selectedSupplier.products && selectedSupplier.products.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSupplier.products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay productos registrados</p>
                )}
              </div>

              {/* Información Adicional */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📝 Información Adicional</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Registro</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedSupplier.createdAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última Actualización</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedSupplier.updatedAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDetailsOpen(false);
                  openEditDialog(selectedSupplier);
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

      {/* EDIT MODAL */}
      {editOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-gray-900">Editar Proveedor: {selectedSupplier.name}</h3>
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

            <form onSubmit={handleUpdateSupplier} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIT
                  </label>
                  <input
                    type="text"
                    name="nit"
                    value={formData.nit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.countryId}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45]"
                  >
                    <option value="">Seleccionar...</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento/Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.stateId}
                    onChange={(e) => handleStateChange(e.target.value)}
                    disabled={!formData.countryId}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar...</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    disabled={!formData.stateId}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6b7c45] disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar...</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
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
                    'Actualizar Proveedor'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                ¿Eliminar Proveedor?
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                ¿Estás seguro de que deseas eliminar a <span className="font-semibold">{selectedSupplier.name}</span>? 
                Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setSelectedSupplier(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md font-semibold text-sm transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteSupplier}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
        </div>
      )}

      {/* Details, Edit y Delete modales continúan... */}
    </Layout>
  );
}
