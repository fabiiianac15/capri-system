export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatar?: string;
        phone?: string;
        bio?: string;
        createdAt: Date;
        updatedAt?: Date;
    };
    token: string;
}
declare class AuthService {
    register(data: RegisterData): Promise<AuthResponse>;
    login(data: LoginData): Promise<AuthResponse>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, data: {
        name?: string;
        email?: string;
        avatar?: string;
        phone?: string;
        bio?: string;
    }): Promise<any>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map