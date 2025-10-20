import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ImageUpload } from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth.service';
import { User, Lock, Bell, Save, Loader2, CheckCircle, Eye, Mail, Phone, Calendar, Shield, FileText, Edit } from 'lucide-react';

type TabType = 'overview' | 'profile' | 'security' | 'preferences';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const updatedUser = await authService.updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        avatar: profileForm.avatar,
        phone: profileForm.phone,
        bio: profileForm.bio
      });

      // Actualizar el contexto con el usuario actualizado
      updateUser(updatedUser);
      setSuccessMessage('Perfil actualizado exitosamente');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      alert(error.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      setIsSubmitting(false);
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setSuccessMessage('Contraseña actualizada exitosamente');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (base64Image: string) => {
    setProfileForm({ ...profileForm, avatar: base64Image });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header - Modernizado */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e02] via-[#2a4a04] to-[#4a7c0b]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNNiA2YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
            
            <div className="relative p-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg">
                  <span className="text-5xl">👤</span>
                </div>
                <div className="text-white">
                  <h2 className="text-4xl font-black mb-2">Mi Perfil</h2>
                  <p className="text-white/90 text-lg font-semibold">Administra tu información personal y preferencias del sistema</p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                  Vista General
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Edit className="w-5 h-5" />
                  Editar Perfil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'security'
                      ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  Seguridad
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'preferences'
                      ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  Preferencias
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Profile Header with Avatar */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-gray-200">
                    <div className="flex-shrink-0">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-green-100 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center border-4 border-green-100 shadow-lg">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-600 mt-1 flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                      </p>
                      {user?.phone && (
                        <p className="text-gray-600 mt-1 flex items-center justify-center md:justify-start gap-2">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </p>
                      )}
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Shield className="w-4 h-4 mr-1" />
                        {user?.role === 'COORDINADOR' ? 'Coordinador' : user?.role === 'EMPLEADO' ? 'Empleado' : 'Pasante'}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar Perfil
                    </button>
                  </div>

                  {/* Bio Section */}
                  {user?.bio && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">Biografía</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                    </div>
                  )}

                  {/* Information Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Información Personal
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">Nombre Completo</p>
                          <p className="text-gray-900 font-medium mt-1">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">Correo Electrónico</p>
                          <p className="text-gray-900 font-medium mt-1">{user?.email}</p>
                        </div>
                        {user?.phone && (
                          <div>
                            <p className="text-xs text-gray-600 uppercase font-medium">Teléfono</p>
                            <p className="text-gray-900 font-medium mt-1">{user.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* System Information Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        Información del Sistema
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">ID de Usuario</p>
                          <p className="text-gray-900 font-medium mt-1 font-mono text-sm">{user?.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">Rol</p>
                          <p className="text-gray-900 font-medium mt-1">
                            {user?.role === 'COORDINADOR' ? '👑 Coordinador' : user?.role === 'EMPLEADO' ? '👤 Empleado' : '🎓 Pasante'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">Miembro Desde</p>
                          <p className="text-gray-900 font-medium mt-1 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CO', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'N/A'}
                          </p>
                        </div>
                        {user?.updatedAt && (
                          <div>
                            <p className="text-xs text-gray-600 uppercase font-medium">Última Actualización</p>
                            <p className="text-gray-900 font-medium mt-1">
                              {new Date(user.updatedAt).toLocaleDateString('es-CO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Activity Stats (Placeholder) */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Cabras Registradas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Ventas Realizadas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Productos Gestionados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-orange-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Días Activo</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-4 italic">
                      Las estadísticas de actividad se actualizarán automáticamente
                    </p>
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                    <ImageUpload
                      currentImage={profileForm.avatar}
                      onImageChange={handleAvatarChange}
                    />
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Biografía
                      </label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Cuéntanos sobre ti..."
                      />
                    </div>
                  </div>

                  {/* User Info (Read-only) */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Información del Sistema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Rol</p>
                        <p className="font-medium text-gray-900">
                          {user?.role === 'COORDINADOR' ? 'Coordinador' : user?.role === 'EMPLEADO' ? 'Empleado' : 'Pasante'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Miembro desde</p>
                        <p className="font-medium text-gray-900">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Tu contraseña debe tener al menos 6 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual *
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {passwordForm.newPassword && passwordForm.confirmPassword && 
                   passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="text-red-600 text-sm">Las contraseñas no coinciden</p>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Actualizar Contraseña
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* PREFERENCES TAB */}
              {activeTab === 'preferences' && (
                <div className="space-y-6 max-w-xl">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de la Aplicación</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Personaliza tu experiencia en el sistema
                    </p>
                  </div>

                  {/* Theme Toggle (placeholder - theme is in Header) */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Tema</p>
                      <p className="text-sm text-gray-600">Cambia entre tema claro y oscuro</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Disponible en el menú superior →
                    </div>
                  </div>

                  {/* Notifications (placeholder) */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Notificaciones</p>
                      <p className="text-sm text-gray-600">Recibe alertas sobre eventos importantes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  {/* Language (placeholder) */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-900 mb-2">Idioma</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  {/* Date Format (placeholder) */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block font-medium text-gray-900 mb-2">Formato de Fecha</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      Más opciones de preferencias estarán disponibles próximamente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
