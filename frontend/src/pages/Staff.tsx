import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { staffService, type Staff, type StaffType, type Manager } from '../services/staff.service';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  X, 
  Loader2,
  Filter,
  DollarSign,
  Calendar,
  Award,
  UserCheck
} from 'lucide-react';

const STAFF_TYPES: StaffType[] = ['ADMINISTRATIVO', 'PRACTICANTE'];

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    staffType: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    dni: '',
    staffType: 'ADMINISTRATIVO' as StaffType,
    salary: '',
    yearsExperience: '',
    specialization: '',
    academicDegree: '',
    managerId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [staffData, managersData] = await Promise.all([
        staffService.getAll(filters.staffType ? { staffType: filters.staffType } : {}),
        staffService.getManagers()
      ]);
      setStaff(staffData);
      setManagers(managersData);
    } catch (error) {
      console.error('Error loading staff:', error);
      alert('Error al cargar empleados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await staffService.create({
        fullName: formData.fullName,
        dni: formData.dni,
        staffType: formData.staffType,
        salary: parseFloat(formData.salary),
        yearsExperience: parseInt(formData.yearsExperience),
        specialization: formData.specialization || undefined,
        academicDegree: formData.academicDegree || undefined,
        managerId: formData.managerId || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined
      });
      
      alert('Empleado creado exitosamente');
      setCreateOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear empleado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    try {
      setIsSubmitting(true);
      await staffService.update(selectedStaff.id, {
        fullName: formData.fullName,
        dni: formData.dni,
        staffType: formData.staffType,
        salary: parseFloat(formData.salary),
        yearsExperience: parseInt(formData.yearsExperience),
        specialization: formData.specialization || undefined,
        academicDegree: formData.academicDegree || undefined,
        managerId: formData.managerId || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined
      });
      
      alert('Empleado actualizado exitosamente');
      setEditOpen(false);
      setSelectedStaff(null);
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al actualizar empleado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;

    try {
      setIsSubmitting(true);
      await staffService.delete(selectedStaff.id);
      
      alert('Empleado eliminado exitosamente');
      setDeleteConfirmOpen(false);
      setSelectedStaff(null);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al eliminar empleado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setFormData({
      fullName: staffMember.fullName,
      dni: staffMember.dni,
      staffType: staffMember.staffType,
      salary: staffMember.salary.toString(),
      yearsExperience: staffMember.yearsExperience.toString(),
      specialization: staffMember.specialization || '',
      academicDegree: staffMember.academicDegree || '',
      managerId: staffMember.managerId || '',
      startDate: new Date(staffMember.startDate).toISOString().split('T')[0],
      endDate: staffMember.endDate ? new Date(staffMember.endDate).toISOString().split('T')[0] : ''
    });
    setEditOpen(true);
  };

  const openDetailsModal = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setDetailsOpen(true);
  };

  const openDeleteModal = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setDeleteConfirmOpen(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      dni: '',
      staffType: 'ADMINISTRATIVO',
      salary: '',
      yearsExperience: '',
      specialization: '',
      academicDegree: '',
      managerId: '',
      startDate: '',
      endDate: ''
    });
  };

  const filteredStaff = staff.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.dni.includes(searchTerm)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            <p className="text-xl font-medium text-gray-700">Cargando empleados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="space-y-6">
          {/* HEADER - Modernizado */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e02] via-[#2a4a04] to-[#4a7c0b]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                    <span className="text-5xl">👥</span>
                  </div>
                  <div className="text-white">
                    <h2 className="text-4xl font-black mb-2">Gestión de Personal</h2>
                    <p className="text-white/90 text-lg font-semibold">Administra los empleados y su jerarquía organizacional</p>
                  </div>
                </div>
                <button
                  onClick={() => setCreateOpen(true)}
                  className="group px-6 py-3 bg-white text-[#2a4a04] hover:text-[#1a2e02] rounded-xl transition-all font-black shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Nuevo Empleado
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH AND FILTERS - Modernizado */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 animate-fade-in">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#e8f0d8] to-transparent rounded-full -mr-20 -mt-20"></div>
            
            <div className="relative flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] transition-all font-medium shadow-sm"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`px-6 py-3 rounded-xl border-2 transition-all flex items-center gap-2 font-bold shadow-md hover:shadow-lg ${
                  filtersOpen
                    ? 'bg-gradient-to-r from-[#4a7c0b] to-[#6b7c45] text-white border-[#4a7c0b]'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filtros
                {filters.staffType && (
                  <span className="ml-1 px-2.5 py-0.5 bg-white/30 rounded-full text-xs font-black">1</span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {filtersOpen && (
              <div className="mt-6 pt-6 border-t-2 border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-[#1a2e02] mb-2">
                    Tipo de Personal
                  </label>
                  <select
                    value={filters.staffType}
                    onChange={(e) => setFilters({ ...filters, staffType: e.target.value })}
                    className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#6b7c45]/20 focus:border-[#4a7c0b] font-medium bg-white shadow-sm"
                  >
                    <option value="">Todos</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                    <option value="PRACTICANTE">Practicante</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ staffType: '' })}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Empleados</p>
                  <p className="text-3xl font-bold text-gray-900">{staff.length}</p>
                </div>
                <Users className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Administrativos</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {staff.filter(s => s.staffType === 'ADMINISTRATIVO').length}
                  </p>
                </div>
                <Award className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Practicantes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {staff.filter(s => s.staffType === 'PRACTICANTE').length}
                  </p>
                </div>
                <UserCheck className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experiencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gerente
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No hay empleados registrados</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((staffMember) => (
                      <tr key={staffMember.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {staffMember.fullName}
                            </div>
                            {staffMember.academicDegree && (
                              <div className="text-xs text-gray-500">{staffMember.academicDegree}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {staffMember.dni}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            staffMember.staffType === 'ADMINISTRATIVO'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {staffMember.staffType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(staffMember.salary)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {staffMember.yearsExperience} años
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {staffMember.manager?.fullName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openDetailsModal(staffMember)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Ver detalles"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openEditModal(staffMember)}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                              title="Editar"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(staffMember)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODAL CREATE */}
          {createOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Nuevo Empleado</h2>
                  <button
                    onClick={() => { setCreateOpen(false); resetForm(); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DNI *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Personal *
                      </label>
                      <select
                        required
                        value={formData.staffType}
                        onChange={(e) => setFormData({ ...formData, staffType: e.target.value as StaffType })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {STAFF_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salario (COP) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1000"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Años de Experiencia *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialización
                      </label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título Académico
                      </label>
                      <input
                        type="text"
                        value={formData.academicDegree}
                        onChange={(e) => setFormData({ ...formData, academicDegree: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gerente/Superior
                      </label>
                      <select
                        value={formData.managerId}
                        onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Sin gerente</option>
                        {managers.map(manager => (
                          <option key={manager.id} value={manager.id}>
                            {manager.fullName} - {manager.dni}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Finalización
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => { setCreateOpen(false); resetForm(); }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        'Crear Empleado'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL EDIT */}
          {editOpen && selectedStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Editar Empleado</h2>
                  <button
                    onClick={() => { setEditOpen(false); setSelectedStaff(null); resetForm(); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DNI *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.dni}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Personal *
                      </label>
                      <select
                        required
                        value={formData.staffType}
                        onChange={(e) => setFormData({ ...formData, staffType: e.target.value as StaffType })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {STAFF_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salario (COP) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1000"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Años de Experiencia *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialización
                      </label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título Académico
                      </label>
                      <input
                        type="text"
                        value={formData.academicDegree}
                        onChange={(e) => setFormData({ ...formData, academicDegree: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gerente/Superior
                      </label>
                      <select
                        value={formData.managerId}
                        onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Sin gerente</option>
                        {managers.filter(m => m.id !== selectedStaff.id).map(manager => (
                          <option key={manager.id} value={manager.id}>
                            {manager.fullName} - {manager.dni}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Finalización
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => { setEditOpen(false); setSelectedStaff(null); resetForm(); }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        'Actualizar'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL DETAILS */}
          {detailsOpen && selectedStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Detalles del Empleado</h2>
                  <button
                    onClick={() => { setDetailsOpen(false); setSelectedStaff(null); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Información Personal */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Nombre Completo</p>
                        <p className="font-medium text-gray-900">{selectedStaff.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">DNI</p>
                        <p className="font-medium text-gray-900">{selectedStaff.dni}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tipo de Personal</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedStaff.staffType === 'ADMINISTRATIVO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedStaff.staffType}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Título Académico</p>
                        <p className="font-medium text-gray-900">{selectedStaff.academicDegree || 'No especificado'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información Laboral */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Información Laboral
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Salario</p>
                        <p className="font-bold text-lg text-green-600">{formatCurrency(selectedStaff.salary)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Años de Experiencia</p>
                        <p className="font-medium text-gray-900">{selectedStaff.yearsExperience} años</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Especialización</p>
                        <p className="font-medium text-gray-900">{selectedStaff.specialization || 'No especificada'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gerente/Superior</p>
                        <p className="font-medium text-gray-900">{selectedStaff.manager?.fullName || 'Sin gerente'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Fechas
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Inicio</p>
                        <p className="font-medium text-gray-900">{formatDate(selectedStaff.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Finalización</p>
                        <p className="font-medium text-gray-900">
                          {selectedStaff.endDate ? formatDate(selectedStaff.endDate) : 'Activo'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subordinados */}
                  {selectedStaff.subordinates && selectedStaff.subordinates.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Subordinados ({selectedStaff.subordinates.length})
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        {selectedStaff.subordinates.map(sub => (
                          <div key={sub.id} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                            <div>
                              <p className="font-medium text-gray-900">{sub.fullName}</p>
                              <p className="text-sm text-gray-600">{sub.dni}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              sub.staffType === 'ADMINISTRATIVO'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {sub.staffType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                  <button
                    onClick={() => { setDetailsOpen(false); setSelectedStaff(null); }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL DELETE */}
          {deleteConfirmOpen && selectedStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    ¿Eliminar Empleado?
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    ¿Estás seguro de que deseas eliminar a <strong>{selectedStaff.fullName}</strong>?
                    Esta acción no se puede deshacer.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setDeleteConfirmOpen(false); setSelectedStaff(null); }}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        'Eliminar'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
