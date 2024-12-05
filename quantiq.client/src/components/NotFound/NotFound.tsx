import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <h1 className={styles.notFoundTitle}>404</h1>
        <p className={styles.notFoundMessage}>Oops! The page you're looking for doesn't exist.</p>
        <button
          className={styles.notFoundBtn}
          onClick={() => window.location.href = '/'}
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;