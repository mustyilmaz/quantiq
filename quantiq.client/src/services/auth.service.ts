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

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  turnstileToken: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

interface UserDetailsResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export class AuthService {
  private readonly API_URL = '/api';

  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return false;
      }
      const response = await fetch(`${this.API_URL}/Auth/verify-token`, {
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          return { success: false, error: errorJson.message || 'Giriş işlemi başarısız oldu' };
        } catch {
          return { success: false, error: errorText || 'Giriş işlemi başarısız oldu' };
        }
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('session_id', data.sessionId);
        return { success: true, token: data.sessionId };
      } else {
        return { success: false, error: data.message || 'Giriş işlemi başarısız oldu' };
      }
    } catch (error) {
      console.error('Giriş işlemi hatası:', error);
      return { success: false, error: 'Giriş işlemi başarısız oldu' };
    }
  }

  async logout(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/Auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Çıkış işlemi hatası:', error);
      return false;
    }
  }

  async getUserDetails(): Promise<UserDetailsResponse> {
    try {
      const response = await fetch(`${this.API_URL}/User/details`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
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
}

export const authService = new AuthService(); 