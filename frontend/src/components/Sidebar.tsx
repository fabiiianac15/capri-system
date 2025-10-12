import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Sparkles, 
  Users, 
  Truck, 
  Package, 
  Pill, 
  Syringe, 
  Heart, 
  BarChart3, 
  Milk, 
  Settings, 
  LogOut, 
  Menu,
  ChevronRight,
  ChevronDown,
  PawPrint
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, href, isActive, collapsed, onClick }: NavItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-2 px-3 py-2 rounded-md text-white transition-all duration-200
        hover:bg-[#2a4a04] hover:text-white
        ${isActive ? 'bg-[#2a4a04]' : ''}
        ${collapsed ? 'justify-center px-2' : 'justify-start'}
      `}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      {!collapsed && <span className="text-sm">{label}</span>}
    </button>
  );
}

interface CollapsibleMenuProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  collapsed: boolean;
  defaultOpen?: boolean;
}

function CollapsibleMenu({ icon, label, children, collapsed, defaultOpen = false }: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (collapsed) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-white hover:bg-[#2a4a04] transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex-shrink-0">{icon}</span>
          <span className="text-sm">{label}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="pl-6 space-y-1 mt-1">
          {children}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ isMobileOpen = false, onClose }: SidebarProps = {}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    if (isMobileOpen && onClose) {
      onClose();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pathname = location.pathname;

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-[#1a2e02] text-white flex-shrink-0 transition-all duration-300 h-screen z-50
          ${collapsed ? 'w-16' : 'w-64'}
          md:block md:sticky md:top-0
          ${isMobileOpen ? 'fixed top-0 left-0' : 'hidden md:block'}
        `}
      >
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h2 className="text-xl font-bold">Granme</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-[#2a4a04] p-2 rounded-md transition-all duration-200"
            title={collapsed ? 'Expandir' : 'Contraer'}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <NavItem
            icon={<Sparkles className="w-5 h-5" />}
            label="Inicio"
            href="/welcome"
            isActive={pathname === '/welcome'}
            collapsed={collapsed}
          />
          
          <NavItem
            icon={<Home className="w-5 h-5" />}
            label="Dashboard"
            href="/dashboard"
            isActive={pathname === '/dashboard'}
            collapsed={collapsed}
          />

          <NavItem
            icon={<PawPrint className="w-5 h-5" />}
            label="Registro Caprino"
            href="/goats"
            isActive={pathname === '/goats'}
            collapsed={collapsed}
          />

          <NavItem
            icon={<Truck className="w-5 h-5" />}
            label="Proveedores"
            href="/suppliers"
            isActive={pathname === '/suppliers'}
            collapsed={collapsed}
          />

          <NavItem
            icon={<Users className="w-5 h-5" />}
            label="Empleados"
            href="/staff"
            isActive={pathname === '/staff'}
            collapsed={collapsed}
          />

          {/* Inventario - Colapsable */}
          {collapsed ? (
            <NavItem
              icon={<Package className="w-5 h-5" />}
              label="Inventario"
              href="/products"
              isActive={pathname === '/products'}
              collapsed={collapsed}
            />
          ) : (
            <CollapsibleMenu
              icon={<Package className="w-5 h-5" />}
              label="Inventario"
              collapsed={collapsed}
              defaultOpen={pathname.includes('/products')}
            >
              <NavItem
                icon={<Package className="w-4 h-4" />}
                label="Productos"
                href="/products"
                isActive={pathname === '/products'}
                collapsed={false}
              />
            </CollapsibleMenu>
          )}

          <NavItem
            icon={<Pill className="w-5 h-5" />}
            label="Medicamentos"
            href="/medicamentos"
            isActive={pathname === '/medicamentos'}
            collapsed={collapsed}
          />

          <NavItem
            icon={<Syringe className="w-5 h-5" />}
            label="Aplicaciones"
            href="/aplicaciones"
            isActive={pathname === '/aplicaciones'}
            collapsed={collapsed}
          />

          <NavItem
            icon={<Heart className="w-5 h-5" />}
            label="Reproducción"
            href="/reproduccion"
            isActive={pathname === '/reproduccion'}
            collapsed={collapsed}
          />

          {/* Reportes - Colapsable */}
          {collapsed ? (
            <NavItem
              icon={<BarChart3 className="w-5 h-5" />}
              label="Reportes"
              href="/reportes"
              isActive={pathname === '/reportes'}
              collapsed={collapsed}
            />
          ) : (
            <CollapsibleMenu
              icon={<BarChart3 className="w-5 h-5" />}
              label="Reportes"
              collapsed={collapsed}
              defaultOpen={pathname.includes('/reportes')}
            >
              <NavItem
                icon={<BarChart3 className="w-4 h-4" />}
                label="Estadísticas"
                href="/reportes?tab=statistics"
                isActive={pathname === '/reportes' && location.search.includes('statistics')}
                collapsed={false}
              />
              <NavItem
                icon={<BarChart3 className="w-4 h-4" />}
                label="Gráficas"
                href="/reportes?tab=charts"
                isActive={pathname === '/reportes' && location.search.includes('charts')}
                collapsed={false}
              />
            </CollapsibleMenu>
          )}

          <NavItem
            icon={<Milk className="w-5 h-5" />}
            label="Ventas"
            href="/ventas"
            isActive={pathname === '/ventas'}
            collapsed={collapsed}
          />

          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label="Configuración"
            href="/configuracion"
            isActive={pathname === '/configuracion'}
            collapsed={collapsed}
          />
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[#2a4a04]">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-[#2a4a04] transition-all duration-200
              ${collapsed ? 'justify-center px-2' : 'justify-start'}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
