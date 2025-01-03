import React, { createContext, useState, useEffect } from 'react';
import { AuthService, AuthResponse } from '../services/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  lastLoginAt: string;
}

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  turnstileToken: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => ({ success: false, error: 'Varsayılan login fonksiyonu kullanıldı.' }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.getUserDetails();
        if (response.success && response.user) {
          setIsAuthenticated(true);
          setUser(response.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Yetkilendirme kontrolü başarısız:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authService.login(credentials);
    if (response.success) {
      const userResponse = await authService.getUserDetails();
      if (userResponse.success && userResponse.user) {
        setIsAuthenticated(true);
        setUser(userResponse.user);
      }
    }
    console.log("AuthContext login response", response);
    return response;
  };

  const logout = async () => {
    const success = await authService.logout();
    if (success) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;