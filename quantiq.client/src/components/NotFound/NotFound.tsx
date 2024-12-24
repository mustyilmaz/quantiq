import styles from './NotFound.module.css';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found - 404 - Quantiq";
  }, []);

  return (
    <div className={styles.notFoundContainer}>
      <motion.div
        className={styles.notFoundContent}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className={styles.notFoundTitle}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          404
        </motion.h1>
        <p className={styles.notFoundMessage}>
          Böyle bir sayfa bulunamadı. Sayfa kaldırılmış veya değiştirilmiş olabilir.
        </p>
        <motion.button
          className={styles.notFoundBtn}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.href = '/'}
        >
          Anasayfaya git
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;