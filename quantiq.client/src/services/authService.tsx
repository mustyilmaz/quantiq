import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  lastLoginAt: string;
}

interface VerifyTokenResponse {
  success: boolean;
  user: User | null;
}

class AuthService {
  async verifyToken(): Promise<VerifyTokenResponse> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, user: null };
      }

      const response = await fetch('/api/Auth/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token doğrulama başarısız');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return { success: false, user: null };
    }
  }

  async login(emailOrPhone: string, password: string, turnstileToken: string) {
    try {
      const response = await fetch('/api/Auth/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone,
          password,
          turnstileToken
        })
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        return { success: true, token: data.token };
      }
      
      return { success: false, error: data.message };
    } catch (error) {
      console.error('Giriş işlemi hatası:', error);
      return { success: false, error: 'Giriş işlemi başarısız oldu' };
    }
  }

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/Auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      return { success: false, message: 'Şifre değiştirme işlemi başarısız oldu' };
    }
  }
}

export const authService = new AuthService();

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  updateAuthStatus: (status: boolean, name: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userName: '',
  updateAuthStatus: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const updateAuthStatus = (status: boolean, name: string) => {
    setIsAuthenticated(status);
    setUserName(name);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, updateAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 