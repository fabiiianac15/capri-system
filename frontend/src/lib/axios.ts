import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token agregado a la petición:', config.url);
    } else {
      console.warn('⚠️ No hay token disponible para:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa de:', response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.error(`❌ Error ${status} en ${url}:`, error.response?.data);
    
    if (status === 401) {
      console.error('🔒 Error de autenticación. Token actual:', localStorage.getItem('token')?.substring(0, 20) + '...');
      
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Solo redirigir si no estamos ya en una página pública
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/register'];
      
      if (!publicPaths.includes(currentPath)) {
        console.log('🔄 Redirigiendo a login...');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
