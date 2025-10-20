import api from '../lib/axios';
import type { AuthResponse, LoginData, RegisterData, User } from '../types/index';

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', data);
    const { user, token } = response.data.data;
    
    console.log('🔑 Login exitoso. Guardando token...', token.substring(0, 20) + '...');
    
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Verificar que se guardó correctamente
    const savedToken = localStorage.getItem('token');
    console.log('✅ Token guardado correctamente:', savedToken === token);
    
    return response.data.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<{ data: AuthResponse }>('/auth/register', data);
    const { user, token } = response.data.data;
    
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/profile');
    return response.data.data;
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
    avatar?: string;
    phone?: string;
    bio?: string;
  }): Promise<User> {
    const response = await api.put<{ data: User }>('/auth/profile', data);
    const updatedUser = response.data.data;
    
    // Actualizar localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', { currentPassword, newPassword });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
