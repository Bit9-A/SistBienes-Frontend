import { useState, useEffect } from 'react';

interface AuthUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  dept_id: number;
  tipo_usuario: number;
  cedula: string;
  token?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Verificar si el usuario tiene un token válido
        if (userData && userData.token) {
          setUser(userData);
        } else {
          // Si no hay token, limpiar localStorage
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error al verificar el estado de autenticación:', error);
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: AuthUser) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = (): boolean => {
    return user !== null && user.token !== undefined;
  };

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    checkAuthStatus
  };
};
