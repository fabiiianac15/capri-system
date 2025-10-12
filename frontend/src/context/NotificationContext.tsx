import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { medicamentoService } from '../services/medicamento.service';
import { montaService } from '../services/monta.service';

export type NotificationType = 'VENCIMIENTO' | 'STOCK_CRITICO' | 'STOCK_BAJO' | 'PROXIMO_PARTO' | 'PARTO_ATRASADO' | 'INFO';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string; // Ruta a la que navegar al hacer click
  priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para cargar todas las notificaciones
  const refreshNotifications = async () => {
    try {
      setLoading(true);
      const allNotifications: Notification[] = [];

      // 1. Cargar alertas de medicamentos
      try {
        const alertasMedicamentos = await medicamentoService.getAlertas();
        
        alertasMedicamentos.forEach((alerta) => {
          let type: NotificationType = 'INFO';
          let priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA' = 'MEDIA';

          switch (alerta.tipo) {
            case 'STOCK_CRITICO':
              type = 'STOCK_CRITICO';
              priority = 'CRITICA';
              break;
            case 'STOCK_BAJO':
              type = 'STOCK_BAJO';
              priority = 'ALTA';
              break;
            case 'VENCIMIENTO':
              type = 'VENCIMIENTO';
              priority = 'ALTA';
              break;
          }

          allNotifications.push({
            id: `med-${alerta.medicamento.id}`,
            type,
            title: alerta.medicamento.nombre,
            message: alerta.mensaje,
            timestamp: new Date(),
            read: false,
            link: '/medicamentos',
            priority,
          });
        });
      } catch (error) {
        console.error('Error cargando alertas de medicamentos:', error);
      }

      // 2. Cargar próximos partos (próximos 7 días)
      try {
        const proximosPartos = await montaService.getProximosPartos();
        
        proximosPartos.forEach((monta) => {
          const diasRestantes = Math.ceil(
            (new Date(monta.fechaEstimadaParto).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          let priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA' = 'MEDIA';
          let type: NotificationType = 'PROXIMO_PARTO';

          if (diasRestantes < 0) {
            priority = 'CRITICA';
            type = 'PARTO_ATRASADO';
          } else if (diasRestantes <= 3) {
            priority = 'ALTA';
          } else if (diasRestantes <= 7) {
            priority = 'MEDIA';
          }

          const hembraNombre = monta.hembra?.name || `Cabra ${monta.hembraId}`;
          
          allNotifications.push({
            id: `parto-${monta.id}`,
            type,
            title: diasRestantes < 0 ? `Parto atrasado - ${hembraNombre}` : `Próximo parto - ${hembraNombre}`,
            message: diasRestantes < 0 
              ? `El parto está atrasado por ${Math.abs(diasRestantes)} días`
              : `Fecha estimada de parto en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`,
            timestamp: new Date(monta.fechaEstimadaParto),
            read: false,
            link: '/reproduccion',
            priority,
          });
        });
      } catch (error) {
        console.error('Error cargando próximos partos:', error);
      }

      // Ordenar por prioridad y fecha
      const priorityOrder = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };
      allNotifications.sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones al montar (solo si hay token)
  useEffect(() => {
    // Verificar si hay token antes de intentar cargar
    const token = localStorage.getItem('token');
    if (!token) {
      return; // No cargar notificaciones si no hay token
    }

    refreshNotifications();

    // Refrescar cada 5 minutos
    const interval = setInterval(() => {
      refreshNotifications();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de un NotificationProvider');
  }
  return context;
}
