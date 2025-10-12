import { useState, useEffect } from 'react';
import { Bell, HelpCircle, Menu, Moon, Search, Settings, Sun, User, LogOut, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Función para formatear tiempo relativo
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
    
    // Obtener tema del localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Obtener iniciales para el avatar
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-[#6b7c45] text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Sección Izquierda - Logo/Título */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-[#5a6a3a] hover:text-white"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menú</span>
          </Button>
          <div className="md:hidden">
            <h1 className="text-xl font-bold">Granme</h1>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold">Sistema de Gestión Granme</h1>
          </div>
        </div>

        {/* Sección Central - Búsqueda (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8 w-[200px] bg-[#5a6a3a] border-[#5a6a3a] text-white placeholder:text-white/70 focus-visible:ring-white"
            />
          </div>

          {/* Notificaciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-[#5a6a3a] hover:text-white">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-[#6b7c45]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notificaciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px] max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <button
                    className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                  >
                    Marcar todas
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => {
                  // Determinar color según prioridad
                  let colorClass = 'bg-blue-50 hover:bg-blue-100';
                  let iconClass = 'text-blue-600';
                  let borderClass = 'border-l-4 border-blue-500';
                  
                  if (notification.priority === 'CRITICA') {
                    colorClass = 'bg-red-50 hover:bg-red-100';
                    iconClass = 'text-red-600';
                    borderClass = 'border-l-4 border-red-500';
                  } else if (notification.priority === 'ALTA') {
                    colorClass = 'bg-orange-50 hover:bg-orange-100';
                    iconClass = 'text-orange-600';
                    borderClass = 'border-l-4 border-orange-500';
                  } else if (notification.priority === 'MEDIA') {
                    colorClass = 'bg-yellow-50 hover:bg-yellow-100';
                    iconClass = 'text-yellow-600';
                    borderClass = 'border-l-4 border-yellow-500';
                  }

                  // Icono según tipo
                  let Icon = Bell;
                  if (notification.type === 'STOCK_CRITICO' || notification.type === 'PARTO_ATRASADO') {
                    Icon = AlertCircle;
                  } else if (notification.type === 'STOCK_BAJO' || notification.type === 'VENCIMIENTO') {
                    Icon = AlertTriangle;
                  } else if (notification.type === 'INFO') {
                    Icon = Info;
                  }

                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start p-3 cursor-pointer ${borderClass} ${colorClass} ${notification.read ? 'opacity-60' : ''}`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          navigate(notification.link);
                        }
                      }}
                    >
                      <div className="flex items-start gap-2 w-full">
                        <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconClass}`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 mb-1">
                            {notification.title}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {notification.message}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatTimestamp(notification.timestamp)}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })
              )}
              
              {notifications.length > 10 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-4 py-2 text-center text-xs text-gray-500">
                    Mostrando 10 de {notifications.length} notificaciones
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Ayuda */}
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#5a6a3a] hover:text-white">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Ayuda</span>
          </Button>

          {/* Toggle Tema */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#5a6a3a] hover:text-white"
            onClick={toggleTheme}
          >
            {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Cambiar tema</span>
          </Button>

          {/* Configuración */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-[#5a6a3a] hover:text-white"
            onClick={() => navigate('/configuracion')}
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configuración</span>
          </Button>
        </div>

        {/* Sección Derecha - Usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 text-white hover:bg-[#5a6a3a] hover:text-white"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={user?.avatar || "/placeholder.svg?height=32&width=32"} 
                  alt={user?.name || 'Usuario'} 
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{user?.name || 'Usuario'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/configuracion')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
