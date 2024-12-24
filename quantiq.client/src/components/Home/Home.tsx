import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  BarChart2, 
  Shield, 
  Users, 
  Globe,
  TrendingUp,
  Award
} from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  useEffect(() => {
    document.title = "Quantiq - E-Ticaret Çözümleri";
  }, []);

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.welcomeText}>E-TİCARET ÇÖZÜMLERİ</span>
          <h1 className={styles.mainTitle}>
            Dijital Dönüşümünüzü <br />
            <span className={styles.highlightText}>Quantiq</span> ile Başlatın
          </h1>
          <p className={styles.heroDescription}>
            Modern e-ticaret çözümlerimizle işletmenizi büyütün, satışlarınızı artırın
            ve müşterilerinize en iyi deneyimi sunun.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/register" className={styles.primaryButton}>
              Hemen Başlayın
            </Link>
            <Link to="/contact" className={styles.secondaryButton}>
              Bize Ulaşın
            </Link>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <p>Aktif Kullanıcı</p>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>98%</span>
              <p>Müşteri Memnuniyeti</p>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24/7</span>
              <p>Teknik Destek</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>ÖZELLİKLERİMİZ</span>
          <h2 className={styles.sectionTitle}>Neden Quantiq?</h2>
          <p className={styles.sectionDescription}>
            E-ticaret süreçlerinizi optimize eden kapsamlı çözümler sunuyoruz
          </p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <ShoppingCart className={styles.featureIcon} />
            <h3>Kolay Entegrasyon</h3>
            <p>Mevcut sistemlerinizle sorunsuz entegrasyon ve hızlı kurulum</p>
          </div>
          <div className={styles.featureCard}>
            <BarChart2 className={styles.featureIcon} />
            <h3>Detaylı Analizler</h3>
            <p>Gerçek zamanlı satış ve performans analizleri</p>
          </div>
          <div className={styles.featureCard}>
            <Shield className={styles.featureIcon} />
            <h3>Güvenli Altyapı</h3>
            <p>En son güvenlik standartlarıyla korunan altyapı</p>
          </div>
          <div className={styles.featureCard}>
            <Globe className={styles.featureIcon} />
            <h3>Çoklu Pazar Yeri</h3>
            <p>Tüm pazaryerlerini tek panelden yönetme imkanı</p>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className={styles.solutionsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>ÇÖZÜMLER</span>
          <h2 className={styles.sectionTitle}>E-Ticaret Çözümlerimiz</h2>
        </div>
        <div className={styles.solutionsGrid}>
          <div className={styles.solutionCard}>
            <TrendingUp className={styles.solutionIcon} />
            <h3>Satış Yönetimi</h3>
            <ul>
              <li>Stok takibi</li>
              <li>Sipariş yönetimi</li>
              <li>Fiyatlandırma stratejileri</li>
            </ul>
          </div>
          <div className={styles.solutionCard}>
            <Users className={styles.solutionIcon} />
            <h3>Müşteri Yönetimi</h3>
            <ul>
              <li>CRM entegrasyonu</li>
              <li>Müşteri segmentasyonu</li>
              <li>Otomatik bildirimler</li>
            </ul>
          </div>
          <div className={styles.solutionCard}>
            <Award className={styles.solutionIcon} />
            <h3>Pazarlama Araçları</h3>
            <ul>
              <li>SEO optimizasyonu</li>
              <li>Sosyal medya entegrasyonu</li>
              <li>E-posta pazarlama</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>REFERANSLAR</span>
          <h2 className={styles.sectionTitle}>Müşterilerimiz Ne Diyor?</h2>
        </div>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p>"Quantiq ile e-ticaret operasyonlarımız çok daha verimli hale geldi. Özellikle çoklu kanal yönetimi konusunda büyük kolaylık sağlıyor."</p>
              <div className={styles.testimonialAuthor}>
                <img src="/path-to-image.jpg" alt="Ahmet Yılmaz" />
                <div>
                  <h4>Ahmet Yılmaz</h4>
                  <span>E-Ticaret Müdürü, TechStore</span>
                </div>
              </div>
            </div>
          </div>
          {/* Diğer testimonial kartları */}
        </div>
      </section>

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