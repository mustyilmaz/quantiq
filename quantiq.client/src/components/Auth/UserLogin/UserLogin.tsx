import React, { useState } from 'react';
import styles from './UserLogin.module.css';

interface LoginData {
  email: string;
  password: string;
}

const UserLogin: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({ ...prev, [id]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/Auth/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/Auth/google-login';
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginWrapper}>
          <h1 className={styles.loginTitle}>Welcome Back</h1>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email</label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
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
              {isLoading ? 'Logging In...' : 'Login'}
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
            Secure login with multiple authentication options.
            Protect your account with our advanced security features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;