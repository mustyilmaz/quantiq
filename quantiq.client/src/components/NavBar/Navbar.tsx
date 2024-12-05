import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        <Link
          to="/"
          className={styles.navbarLogo}
        >
          HomePage
        </Link>
        <ul className={styles.navbarMenu}>
          <li className={styles.navbarItem}>
            <Link
              to="/"
              className={`${styles.navbarLink} ${location.pathname === '/' ? styles.active : ''}`}
            >
              Home
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link
              to="/weather-forecast"
              className={`${styles.navbarLink} ${location.pathname === '/weather-forecast' ? styles.active : ''}`}
            >
              Test Client-server
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link
              to="/register"
              className={`${styles.navbarLink} ${location.pathname === '/register' ? styles.active : ''}`}
            >
              Sign Up
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link
              to="/commission-calculator"
              className={`${styles.navbarLink} ${location.pathname === '/commission-calculator' ? styles.active : ''}`}
            >
              Commission Calculator
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;