import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  lastLoginAt: string;
  isEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
  isProfileRestricted: boolean;
  package: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  updateAuthStatus: (status: boolean, userData: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  updateAuthStatus: () => {},
});

class AuthServiceforClient {
  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return false;
      }
      const response = await fetch('/api/Auth/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if(response.status !== 200){
        return false;
      }
      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return false;
    }
  }

  async login(emailOrPhone: string, password: string, turnstileToken: string) {
    try {
      const response = await fetch('/api/Auth/login', {
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
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Giriş işlemi başarısız oldu');
        } catch (error) {
          console.log("error: ", error);
          throw new Error(errorText || 'Giriş işlemi başarısız oldu');
        }
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Sunucudan geçersiz yanıt alındı");
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        return { success: true, token: data.token };
      } else {
        throw new Error('Token bulunamadı');
      }
    } catch (error) {
      console.error('Giriş işlemi hatası:', error);
      return { success: false, error: 'Giriş işlemi başarısız oldu' };
    }
  }

  async getUserDetails() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return { success: false, error: 'Token bulunamadı' };
      }

      const response = await fetch('/api/User/details', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return { success: false, error: 'Kullanıcı bilgileri alınamadı' };
      }

      const data = await response.json();
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Kullanıcı bilgileri alma hatası:', error);
      return { success: false, error: 'Kullanıcı bilgileri alınamadı' };
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
  }
}

export const authService = new AuthServiceforClient();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const updateAuthStatus = (status: boolean, userData: User | null) => {
    setIsAuthenticated(status);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, updateAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 