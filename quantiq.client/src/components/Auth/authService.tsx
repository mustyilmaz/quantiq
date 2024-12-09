import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface DecodedToken {
  exp: number;
  email: string;
  nameid: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      const response = await axios.post<AuthTokens>('/api/auth/login', credentials);
      
      this.setTokens(response.data);
            
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Refresh token ile yeni access token alma
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<{accessToken: string}>('/api/auth/refresh', { 
        refreshToken 
      });
      
      // Yeni access tokenı kaydet
      this.setAccessToken(response.data.accessToken);
      
      return response.data.accessToken;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // Tokenları local storage'a kaydet
  setTokens(tokens: AuthTokens) {
    localStorage.setItem(this.tokenKey, tokens.accessToken);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
  }

  // Access token'ı al
  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Refresh token'ı al
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Sadece access token'ı güncelle
  setAccessToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Logout işlemi
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    //axios.post('/api/auth/logout');
  }

  // Auth hatalarını işle
  private handleAuthError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.message || 'Authentication failed'
      );
    }
    return error;
  }
}

// Axios Interceptor'ı
function setupAuthInterceptor(authService: AuthService) {
  // İstek interceptor'ı
  axios.interceptors.request.use(
    async (config) => {
      const token = authService.getAccessToken();
      
      if (token) {
        // Token süresini kontrol et
        if (authService.isTokenExpired(token)) {
          try {
            // Token süresiz ise yenile
            const newToken = await authService.refreshAccessToken();
            config.headers['Authorization'] = `Bearer ${newToken}`;
          } catch {
            // Refresh token'ı da geçersiz ise logout yap
            authService.logout();
            window.location.href = '/login';
          }
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Yanıt interceptor'ı
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      // 401 (Unauthorized) durumunda token yenilemesini dene
      if (error.response?.status === 401) {
        try {
          const newToken = await authService.refreshAccessToken();
          
          // Özgün isteği yeniden dene
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(error.config);
        } catch {
          // Yenileme başarısız olursa logout yap
          authService.logout();
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );
}

export const authService = new AuthService();
setupAuthInterceptor(authService);

export default authService;