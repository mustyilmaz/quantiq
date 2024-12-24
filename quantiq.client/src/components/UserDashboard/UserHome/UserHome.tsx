import React, { useEffect, useState } from 'react';
import styles from './UserHome.module.css';
import { authService } from '../../../services/authService';

interface UserInfo {
    success: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        createdAt: string;
        lastLoginAt: string;
    };
}

const UserHome: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Quantiq - E-Commerce Çözümleri - Hoş Geldiniz";
        const fetchUserInfo = async () => {
            try {
                const userData = await authService.verifyToken();
                setUserInfo(userData);
            } catch (err) {
                console.error(err);
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
                <h1>Hoş Geldiniz, {userInfo?.user.name}!</h1>
                <div className={styles.userInfo}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>E-posta:</span>
                            <span className={styles.value}>{userInfo?.user.email}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Telefon:</span>
                            <span className={styles.value}>{userInfo?.user.phoneNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
