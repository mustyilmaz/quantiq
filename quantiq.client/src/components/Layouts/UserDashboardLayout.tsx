import { Outlet } from 'react-router-dom';
import UserNavbar from '../UserDashboard/UserNavBar/UserNavBar';
import styles from './UserDashboardLayout.module.css';

const UserDashboardLayout = () => {
  return (
    <div className={styles.dashboardContainer}>
      <UserNavbar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;