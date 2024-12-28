import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  lastLoginAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  updateAuthStatus: (status: boolean, user?: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await authService.verifyToken();
        
        if (response) {
          setIsAuthenticated(true);
          const response = await authService.getUserDetails();
          if (response.success) {
            setUser(response.user ?? null); 
          } else {
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Yetkilendirme kontrolü başarısız:', error);
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const updateAuthStatus = (status: boolean, newUser: User | null = null) => {
    setIsAuthenticated(status);
    setUser(newUser ?? null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, updateAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;