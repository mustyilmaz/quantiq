import React, { useState } from "react";
import styles from "./UserLogin.module.css";
import { authService } from "../authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';

interface LoginData {
  emailOrPhone: string;
  password: string;
}

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const { updateAuthStatus } = useAuth();
  const [loginData, setLoginData] = useState<LoginData>({
    emailOrPhone: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.login({
        emailOrPhone: loginData.emailOrPhone,
        password: loginData.password,
      });
      
      const userData = await authService.verifyToken();
      updateAuthStatus(true, userData.user.name || 'User');
      navigate("/user/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = "/api/Auth/google-login";
    } catch (err) {
      setError("Google login failed");
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
