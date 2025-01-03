import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import Hero from "../Hero/Hero";
import Pricing from '../Pricing/Pricing';
import Testimonials from '../Testimonials/Testimonials';
import Features from '../Features/Features';


const Home = () => {
  useEffect(() => {
    document.title = "Quantiq - E-Ticaret Çözümleri";
  }, []);

  return (
    <div className={styles.homeContainer}>
      <Hero />
     <Features /> 
      <Pricing />
      <Testimonials />
      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>E-Ticaret Yolculuğunuza Bugün Başlayın</h2>
          <p>Ücretsiz demo hesabı oluşturun ve Quantiq'in sunduğu avantajları keşfedin.</p>
          <Link to="/register" className={styles.ctaButton}>
            Ücretsiz Deneyin
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;