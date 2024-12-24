import React, { useEffect, useState } from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [countdown, setCountdown] = useState(10);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Gösterme animasyonu için
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Geri sayım için
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      setIsVisible(false);
      setTimeout(onClose, 300); // Kapanma animasyonundan sonra kaldır
    }

    return () => {
      clearTimeout(showTimer);
      clearInterval(countdownTimer);
    };
  }, [countdown, onClose]);

  return (
    <div
      className={`${styles.notification} ${type === 'success' ? styles.success : styles.error} ${
        isVisible ? styles.show : ''
      }`}
    >
      <p className={styles.message}>{message}</p>
      <p className={styles.countdown}>Otomatik kapanış: {countdown}s</p>
      <button onClick={onClose} className={styles.closeButton}>
        Kapat
      </button>
    </div>
  );
};

export default Notification;