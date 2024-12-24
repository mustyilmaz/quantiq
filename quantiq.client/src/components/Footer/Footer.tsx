import { Link } from "react-router-dom";
import {
  Github,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  MessageCircle,
  FileText,
  Shield,
  HelpCircle,
} from "lucide-react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3>Quantiq</h3>
          <p>
            İşletmenizi dijital dünyada bir adım öne taşıyoruz. Modern
            teknolojiler ve yenilikçi çözümlerle geleceğin iş dünyasına hazırız.
          </p>
          <div className={styles.socialLinks}>
            <a
              href="https://github.com/mustyilmaz/quantiq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Çözümlerimiz</h3>
          <ul>
            <li>
              <Link to="/solutions/enterprise">Kurumsal Çözümler</Link>
            </li>
            <li>
              <Link to="/solutions/cloud">Bulut Hizmetleri</Link>
            </li>
            <li>
              <Link to="/solutions/analytics">Veri Analitiği</Link>
            </li>
            <li>
              <Link to="/solutions/security">Siber Güvenlik</Link>
            </li>
            <li>
              <Link to="/solutions/consulting">Danışmanlık</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Destek</h3>
          <ul>
            <li>
              <Link to="/help">
                <HelpCircle size={16} className={styles.menuIcon} />
                Yardım Merkezi
              </Link>
            </li>
            <li>
              <Link
                to="http://localhost:5146/swagger/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={16} className={styles.menuIcon} />
                API Dokümantasyonu
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <MessageCircle size={16} className={styles.menuIcon} />
                İletişim
              </Link>
            </li>
            <li>
              <Link to="/privacy">
                <Shield size={16} className={styles.menuIcon} />
                Gizlilik Politikası
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>İletişim</h3>
          <ul className={styles.contactList}>
            <li>
              <Mail size={16} />
              <div>
                <strong>E-posta:</strong>
                <p>info@quantiq.com</p>
              </div>
            </li>
            <li>
              <Phone size={16} />
              <div>
                <strong>Telefon:</strong>
                <p>+90 (555) 123 4567</p>
              </div>
            </li>
            <li>
              <Globe size={16} />
              <div>
                <strong>Adres:</strong>
                <p>Maslak, Sarıyer</p>
                <p>İstanbul, Türkiye</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <p>
            &copy; {new Date().getFullYear()} Quantiq. Tüm hakları saklıdır.
          </p>
          <ul className={styles.footerBottomLinks}>
            <li>
              <Link to="/terms">Kullanım Şartları</Link>
            </li>
            <li>
              <Link to="/privacy">Gizlilik</Link>
            </li>
            <li>
              <Link to="/cookies">Çerez Politikası</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
