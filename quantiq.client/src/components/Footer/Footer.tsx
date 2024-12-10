import { Link } from 'react-router-dom';
import { Github, Mail, Phone, Globe } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3>Hakkımızda</h3>
          <p>Modern ve yenilikçi dijital çözümler sunarak işletmenizi geleceğe taşıyoruz.</p>
        </div>

        <div className={styles.footerSection}>
          <h3>Hızlı Bağlantılar</h3>
          <ul>
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/register">Kayıt Ol</Link></li>
            <li><Link to="/user/login">Giriş Yap</Link></li>
            <li><a href="http://localhost:5146/swagger/index.html" target="_blank" rel="noopener noreferrer">API Docs</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>İletişim</h3>
          <ul className={styles.contactList}>
            <li><Mail size={16} /> info@quantiq.com</li>
            <li><Phone size={16} /> +90 (555) 123 4567</li>
            <li><Globe size={16} /> İstanbul, Türkiye</li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Bizi Takip Edin</h3>
          <div className={styles.socialLinks}>
            <a href="https://github.com/mustyilmaz/quantiq" target="_blank" rel="noopener noreferrer">
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Quantiq. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;