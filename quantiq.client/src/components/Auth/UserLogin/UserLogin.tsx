import React, { useState, useContext, useEffect } from "react";
import styles from "./UserLogin.module.css";
import { useNavigate } from "react-router-dom";
import Turnstile from "react-turnstile";
import { AuthContext } from '../../../context/AuthContext';

interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  turnstileToken: string;
}

interface UserLoginProps {
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ setNotification }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    emailOrPhone: '',
    password: '',
    turnstileToken: ''
  });
  const [loading, setLoading] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);

  useEffect(() => {
    document.title = "Quantiq - E-Commerce Çözümleri - Giriş Yap";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleTurnstileCallback = (token: string) => {
    setCredentials({ ...credentials, turnstileToken: token });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!credentials.turnstileToken) {
      setNotification({
        message: "Lütfen Turnstile doğrulamasını tamamlayın!",
        type: 'error'
      });
      setLoading(false);
      setTurnstileKey(prevKey => prevKey + 1);
      return;
    }

    try {
      const response = await login(credentials);
      if (response.success) {
        setNotification({
          message: "Giriş başarılı! Yönlendiriliyorsunuz.",
          type: 'success'
        });
        navigate('/user/dashboard');
      } else {
        setTurnstileKey(prevKey => prevKey + 1);
        setNotification({
          message: response.error || 'Giriş işlemi başarısız oldu.',
          type: 'error'
        });
      }
    } catch {
      setTurnstileKey(prevKey => prevKey + 1);
      setNotification({
        message: "Bir hata oluştu. Lütfen tekrar deneyin.",
        type: 'error'
      });
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
      setNotification({
        message: loginError.message || "Google ile giriş başarısız oldu",
        type: 'error'
      });
    } */
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginWrapper}>
          <h1 className={styles.loginTitle}>Tekrar Hoş Geldiniz</h1>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="emailOrPhone" className={styles.formLabel}>
                Email veya Telefon Numarası
              </label>
              <input
                type="text"
                id="emailOrPhone"
                className={styles.formInput}
                placeholder="Email veya telefon numaranızı girin"
                value={credentials.emailOrPhone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Şifre
              </label>
              <input
                type="password"
                id="password"
                className={styles.formInput}
                placeholder="Şifrenizi girin"
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
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
            <div className={styles.divider}>
              <span>veya</span>
            </div>
            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleLogin}
            >
              Google ile Giriş Yap
            </button>
            <div className={styles.footerLinks}>
              <a href="/forgot-password" className={styles.forgotPassword}>
                Şifremi Unuttum?
              </a>
              <a href="/register" className={styles.registerLink}>
                Hesap Oluştur
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerContent}>
          <h2>Tekrar Hoş Geldiniz!</h2>
          <p>
            Güvenli bir şekilde hesabınıza giriş yapın ve avantajlardan yararlanın.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;