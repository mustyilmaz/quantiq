import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.css';
import logo from '../../assets/logo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth durumunu kontrol et
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token && !auth.isAuthenticated) {
        // Token var ama auth durumu false ise yeniden kontrol et
        const response = await authService.verifyToken();
        if (response.success && response.user) {
          auth.updateAuthStatus(true, response.user);
        } else {
          localStorage.removeItem('token');
        }
      }
    };

    checkToken();
  }, [auth.isAuthenticated]); // auth durumu değiştiğinde kontrol et

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Loading durumunda minimal navbar göster
  if (auth.isLoading) {
    return (
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logoContainer}>
            <img src={logo} alt="Quantiq Logo" className={styles.logo} />
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logoContainer}>
          <img src={logo} alt="Quantiq Logo" className={styles.logo} />
        </Link>

        <div className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <div className={`${styles.navContent} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navLinks}>
            <li>
              <Link 
                to="/" 
                className={location.pathname === '/' ? styles.active : ''}
                onClick={closeMenu}
              >
                Ana Sayfa
              </Link>
            </li>
            <li className={styles.dropdownContainer}>
              <button 
                className={styles.dropdownTrigger}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Çözümler <ChevronDown size={16} />
              </button>
              <div className={`${styles.dropdown} ${isDropdownOpen ? styles.show : ''}`}>
                <Link to="/solutions/e-commerce" onClick={closeMenu}>E-Ticaret</Link>
                <Link to="/solutions/marketplace" onClick={closeMenu}>Pazar Yeri</Link>
                <Link to="/solutions/analytics" onClick={closeMenu}>Analitik</Link>
              </div>
            </li>
            <li>
              <Link 
                to="/pricing" 
                className={location.pathname === '/pricing' ? styles.active : ''}
                onClick={closeMenu}
              >
                Fiyatlandırma
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={location.pathname === '/contact' ? styles.active : ''}
                onClick={closeMenu}
              >
                İletişim
              </Link>
            </li>
          </ul>

          <div className={styles.navActions}>
            <button 
              className={styles.themeToggle} 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {auth.isAuthenticated && auth.user ? (
              <div className={styles.userMenu}>
                <Link to="/user" className={styles.userButton}>
                  {auth.user.name}
                </Link>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link to="/user/login" className={styles.loginButton} onClick={closeMenu}>
                  Giriş Yap
                </Link>
                <Link to="/register" className={styles.registerButton} onClick={closeMenu}>
                  Ücretsiz Başla
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;