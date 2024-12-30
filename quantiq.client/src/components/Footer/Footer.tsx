import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">Quantiq</h3>
            <p className="text-gray-400 mb-4">
              Gelişmiş analitik ve sorunsuz Trendyol entegrasyonu ile e-ticaret işletmelerini güçlendiriyoruz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Ana Sayfa</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white">Özellikler</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white">Fiyatlandırma</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white">Referanslar</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Destek</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Yardım Merkezi</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Dokümantasyon</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">API Referansı</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Bize Ulaşın</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Quantiq. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;