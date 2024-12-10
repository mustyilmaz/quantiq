import axios from "axios";

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

interface AuthTokens {
  token: string;
}

class AuthService {
  private tokenKey = "auth_token";

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      const response = await axios.post<AuthTokens>("/api/Auth/user-login", {
        emailOrPhone: credentials.emailOrPhone,
        password: credentials.password,
      });

      const token = response.data.token;
      this.setToken(token);

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  async verifyToken(): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get("/api/Auth/verify-token");
      return response.data;
    } catch (error) {
      this.logout();
      throw this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.message || "Authentication failed"
      );
    }
    return error;
  }
}

function setupAuthInterceptor(authService: AuthService) {
  axios.interceptors.request.use(
    (config) => {
      const token = authService.getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authService.logout();
        //window.location.href = "/user/login";
      }
      return Promise.reject(error);
    }
  );
}

export const authService = new AuthService();
setupAuthInterceptor(authService);

export default authService;
