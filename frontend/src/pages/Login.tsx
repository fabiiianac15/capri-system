import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/welcome');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f0d8] via-[#d4e8ba] to-[#c0e09c] p-4 relative overflow-hidden">
      {/* Decoraciones de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#6b7c45]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5a6a3a]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#4a7c0b]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            🌿
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo y Header con animación */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white/90 backdrop-blur-md px-8 py-4 mb-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-[#d3dbb8]">
            <span className="text-6xl animate-bounce-slow">🐐</span>
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-[#1a2e02] tracking-tight">Granme</h1>
              <p className="text-xs text-[#6b7c45] font-semibold tracking-wider">SISTEMA CAPRI</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-[#1a2e02] mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-[#4a7c0b]" />
            Iniciar Sesión
          </h2>
          <p className="text-[#6b7c45] font-medium text-lg">
            Accede al sistema de gestión
          </p>
        </div>

        {/* Formulario Principal con mejor diseño */}
        <div className="w-full overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-[#d3dbb8] animate-fade-in-up">
          <div className="p-8">
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border-l-4 border-red-500 p-4 animate-shake">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group">
                <label 
                  htmlFor="email" 
                  className="flex items-center gap-2 text-sm font-bold text-[#1a2e02] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#4a7c0b]" />
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gradient-to-r from-[#1a2e02] to-[#2a4a04] text-white placeholder:text-gray-400 border-2 border-[#1a2e02] rounded-xl focus:ring-4 focus:ring-[#6b7c45]/30 focus:border-[#4a7c0b] outline-none transition-all duration-300 hover:border-[#4a7c0b]"
                    placeholder="usuario@granja.com"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#4a7c0b]/0 to-[#6b7c45]/0 group-hover:from-[#4a7c0b]/10 group-hover:to-[#6b7c45]/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label 
                  htmlFor="password" 
                  className="flex items-center gap-2 text-sm font-bold text-[#1a2e02]"
                >
                  <Lock className="w-4 h-4 text-[#4a7c0b]" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gradient-to-r from-[#1a2e02] to-[#2a4a04] text-white placeholder:text-gray-400 border-2 border-[#1a2e02] rounded-xl focus:ring-4 focus:ring-[#6b7c45]/30 focus:border-[#4a7c0b] outline-none transition-all duration-300 hover:border-[#4a7c0b]"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#4a7c0b]/0 to-[#6b7c45]/0 group-hover:from-[#4a7c0b]/10 group-hover:to-[#6b7c45]/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full bg-gradient-to-r from-[#4a7c0b] to-[#2a4a04] text-white py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden group mt-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#5a9c1b] to-[#3a5a14] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <span>INGRESAR AL SISTEMA</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">¿Primera vez aquí?</span>
                </div>
              </div>

              <Link 
                to="/register" 
                className="block w-full text-center px-6 py-3 border-2 border-[#4a7c0b] text-[#4a7c0b] rounded-xl font-bold hover:bg-[#4a7c0b] hover:text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Crear Nueva Cuenta ✨
              </Link>

              <div className="text-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 text-sm text-[#6b7c45] hover:text-[#1a2e02] font-semibold transition-colors duration-300"
                >
                  ← Volver a inicio
                </Link>
              </div>
            </div>
          </div>

          {/* Footer del Card */}
          <div className="bg-gradient-to-r from-[#d3dbb8] to-[#c0e09c] px-8 py-4 text-center border-t-2 border-[#c0e09c]">
            <p className="text-xs text-[#1a2e02] font-semibold flex items-center justify-center gap-2">
              <span className="text-base">🌾</span>
              © 2025 Granme - Sistema de Gestión Caprina
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out 0.2s backwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
