import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { authService } from '../Auth/authService';
import { useAuth } from '../Auth/AuthContext';


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLLIElement>(null);
  const { isAuthenticated, userName, updateAuthStatus } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkAuthStatus = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.verifyToken();
          updateAuthStatus(true, userData.user.name || 'User');
        } catch (error) {
          updateAuthStatus(false, '');
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    checkAuthStatus();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [updateAuthStatus]);

  const handleLogout = () => {
    authService.logout();
    updateAuthStatus(false, '');
    setIsUserMenuOpen(false);
    navigate('/user/login');
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo}>
          HomePage
        </Link>
        <ul className={styles.navbarMenu}>
          <li className={styles.navbarItem}>
            <Link to="/" className={`${styles.navbarLink} ${location.pathname === '/' ? styles.active : ''}`}>
              Home
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link to="/weather-forecast" className={`${styles.navbarLink} ${location.pathname === '/weather-forecast' ? styles.active : ''}`}>
              Test Client-server
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link to="/commission-calculator" className={`${styles.navbarLink} ${location.pathname === '/commission-calculator' ? styles.active : ''}`}>
              Commission Calculator
            </Link>
          </li>
          <li className={styles.navbarItem} ref={menuRef}>
            <div 
              className={styles.userMenuTrigger} 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {isAuthenticated ? (
                <span className={styles.userName}>My Account - {userName}</span>
              ) : (
                <span>Sign In / Sign Up</span>
              )}
            </div>
            {isUserMenuOpen && (
              <div className={styles.userMenu}>
                {isAuthenticated ? (
                  <>
                    <Link to="/user/profile" className={styles.menuItem}>Profile</Link>
                    <Link to="/user/settings" className={styles.menuItem}>Settings</Link>
                    <button onClick={handleLogout} className={styles.menuItem}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/user/login" className={styles.menuItem}>Sign In</Link>
                    <Link to="/register" className={styles.menuItem}>Sign Up</Link>
                  </>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;