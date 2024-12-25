import React, { useState, useEffect } from "react";
import styles from "./UserLogin.module.css";
import { authService } from "../../../services/AuthServiceforClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../hooks/useAuth';
import Turnstile from "react-turnstile";

interface LoginData {
  emailOrPhone: string;
  password: string;
  turnstileToken: string;
}

interface LoginError {
  message: string;
}

const UserLogin: React.FC = () => {
  useEffect(() => {
    document.title = "Quantiq - E-Commerce Çözümleri - Giriş Yap";
  }, []);

  const navigate = useNavigate();
  const { updateAuthStatus } = useAuth();
  const [loginData, setLoginData] = useState<LoginData>({
    emailOrPhone: "",
    password: "",
    turnstileToken: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({ ...prev, [id]: value }));
    if (id === 'emailOrPhone') {
      const inputType = value.includes('@') ? 'email' : 'text';
      e.target.type = inputType;
    }
    setError(null);
  };

  const handleTurnstileCallback = (token: string) => {
    setLoginData({ ...loginData, turnstileToken: token });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(
        loginData.emailOrPhone,
        loginData.password,
        loginData.turnstileToken
      );
      
      if (response.success) {
        const verifyResponse = await authService.getUserDetails();
        if (verifyResponse.success && verifyResponse.user) {
          updateAuthStatus(true, verifyResponse.user);
          navigate("/user/");
        } else {
          setError("Kullanıcı bilgileri alınamadı");
        }
      } else {
        setError(response.error || "Giriş başarısız oldu");
      }
    } catch (error) {
      const loginError = error as LoginError;
      setError(loginError.message || "Giriş başarısız oldu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = "/api/Auth/google-login";
    } catch (error) {
      const loginError = error as LoginError;
      setError(loginError.message || "Google ile giriş başarısız oldu");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginWrapper}>
          <h1 className={styles.loginTitle}>Welcome Back</h1>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="emailOrPhone" className={styles.formLabel}>
                Email or Phone Number
              </label>
              <input
                type="text"
                id="emailOrPhone"
                className={styles.formInput}
                placeholder="Enter your email or phone number"
                value={loginData.emailOrPhone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={styles.formInput}
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Turnstile
              sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={handleTurnstileCallback}
              className={styles.turnstile}
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Login"}
            </button>
            <div className={styles.divider}>
              <span>or</span>
            </div>
            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleLogin}
            >
              Login with Google
            </button>
            <div className={styles.footerLinks}>
              <a href="/forgot-password" className={styles.forgotPassword}>
                Forgot Password?
              </a>
              <a href="/register" className={styles.registerLink}>
                Create an Account
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerContent}>
          <h2>Welcome Back!</h2>
          <p>
            Secure login with multiple authentication options. Protect your
            account with our advanced security features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
