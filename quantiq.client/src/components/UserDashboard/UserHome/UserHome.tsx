import React, { useEffect, useState } from 'react';
import styles from './UserHome.module.css';
import { authService } from '../../Auth/authService';

interface UserInfo {
    name: string;
    email: string;
    phoneNumber: string;
}

const UserHome: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await authService.verifyToken();
                setUserInfo(userData);
            } catch (err) {
                setError('Kullanıcı bilgileri alınamadı');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Yükleniyor...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.dashboardHome}>
            <div className={styles.welcomeSection}>
                <h1>Hoş Geldiniz, {userInfo?.name}!</h1>
                <div className={styles.userInfo}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>E-posta:</span>
                            <span className={styles.value}>{userInfo?.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Telefon:</span>
                            <span className={styles.value}>{userInfo?.phoneNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
