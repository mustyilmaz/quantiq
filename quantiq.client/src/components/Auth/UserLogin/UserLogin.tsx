import React, { useState, useEffect, useContext } from "react";
import styles from "./UserLogin.module.css";
import { useNavigate } from "react-router-dom";
import Turnstile from "react-turnstile";
import { AuthContext } from '../../../context/AuthContext';

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  turnstileToken: string;
}

const UserLogin: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    emailOrPhone: '',
    password: '',
    turnstileToken: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);

  useEffect(() => {
    document.title = "Quantiq - E-Commerce Çözümleri - Giriş Yap";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
    if (id === 'emailOrPhone') {
      const inputType = value.includes('@') ? 'email' : 'text';
      e.target.type = inputType;
    }
    setError(null);
  };

  const handleTurnstileCallback = (token: string) => {
    setCredentials({ ...credentials, turnstileToken: token });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(credentials);
      navigate('/user/dashboard');
    } catch {
      setTurnstileKey(prevKey => prevKey + 1);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

   const handleGoogleLogin = async () => {
    alert("Google ile giriş özelliği henüz tamamlanmamıştır.");
    /* try {
      await getCsrfToken();
      window.location.href = "/api/Auth/google-login";
    } catch (error) {
      const loginError = error as LoginError;
      setError(loginError.message || "Google ile giriş başarısız oldu");
    } */
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginWrapper}>
          <h1 className={styles.loginTitle}>Welcome Back</h1>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="emailOrPhone" className={styles.formLabel}>
                Email or Phone Number
              </label>
              <input
                type="text"
                id="emailOrPhone"
                className={styles.formInput}
                placeholder="Enter your email or phone number"
                value={credentials.emailOrPhone}
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
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Turnstile
              key={turnstileKey}
              sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={handleTurnstileCallback}
              className={styles.turnstile}
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
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
