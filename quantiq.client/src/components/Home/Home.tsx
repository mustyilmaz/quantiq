import { Link } from 'react-router-dom';
import { Camera, Trophy, Users, ShieldCheck } from 'lucide-react';

import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <header className={styles.heroSection}>
        <h1 className={styles.mainTitle}>Welcome to Our Digital Solutions</h1>
        <p className={styles.subTitle}>Innovative Technology, Seamless Experiences</p>

        <div className={styles.ctaButtons}>
          <Link to="/register" className={styles.primaryButton}>
            Get Started
          </Link>
          <button className={styles.secondaryButton}>Learn More</button>
        </div>
      </header>

      <section className={styles.featuresSection}>
        <div className={styles.feature}>
          <Camera className={styles.featureIcon} />
          <h3>Creative Design</h3>
          <p>Stunning visual solutions that capture your brand's essence.</p>
        </div>
        <div className={styles.feature}>
          <Trophy className={styles.featureIcon} />
          <h3>Award-Winning Service</h3>
          <p>Recognized for excellence and innovative approach.</p>
        </div>
        <div className={styles.feature}>
          <Users className={styles.featureIcon} />
          <h3>Client-Centric</h3>
          <p>Dedicated to understanding and meeting your unique needs.</p>
        </div>
        <div className={styles.feature}>
          <ShieldCheck className={styles.featureIcon} />
          <h3>Secure Solutions</h3>
          <p>Top-tier security and data protection for your business.</p>
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <h2>What Our Clients Say</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonial}>
            <p>"Exceptional service and innovative solutions!"</p>
            <span className={styles.testimonialAuthor}>- John Doe, CEO</span>
          </div>
          <div className={styles.testimonial}>
            <p>"They transformed our digital presence completely."</p>
            <span className={styles.testimonialAuthor}>- Jane Smith, CTO</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;