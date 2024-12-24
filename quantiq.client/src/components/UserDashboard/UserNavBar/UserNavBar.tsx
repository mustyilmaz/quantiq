import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './UserNavbar.module.css';

const UserNavbar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav 
      className={`${styles.userNavbar} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link 
            to="/user/account-settings"
            className={`${styles.navLink} ${location.pathname === '/user/account-settings' ? styles.active : ''}`}
          >
            <span className={styles.icon}>⚙️</span>
            <span className={styles.linkText}>Account Settings</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link 
            to="/user/change-password"
            className={`${styles.navLink} ${location.pathname === '/user/change-password' ? styles.active : ''}`}
          >
            <span className={styles.icon}>🔒</span>
            <span className={styles.linkText}>Change Password</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link 
            to="/user/api-information"
            className={`${styles.navLink} ${location.pathname === '/user/api-information' ? styles.active : ''}`}
          >
            <span className={styles.icon}>📄</span>
            <span className={styles.linkText}>API Information</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavbar;