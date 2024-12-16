import { Link, useLocation } from 'react-router-dom';
import styles from './UserNavbar.module.css';

const UserNavbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.userNavbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link 
            to="/user/account-settings"
            className={`${styles.navLink} ${location.pathname === '/user/account-settings' ? styles.active : ''}`}
          >
            Account Settings
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link 
            to="/user/api-information"
            className={`${styles.navLink} ${location.pathname === '/user/api-information' ? styles.active : ''}`}
          >
            API Information
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavbar;