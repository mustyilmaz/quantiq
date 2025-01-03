import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Zap, TrendingUp, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-6 w-6 text-indigo-600" />,
    title: 'Hızlı Entegrasyon',
    description: 'Trendyol mağazanızı dakikalar içinde bağlayın. Otomatik senkronizasyon her şeyi güncel tutar.'
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
    title: 'Gelişmiş Analitik',
    description: 'Satış trendleri, müşteri davranışları ve stok yönetimi hakkında detaylı içgörüler elde edin.'
  },
  {
    icon: <Users className="h-6 w-6 text-indigo-600" />,
    title: 'Müşteri İçgörüleri',
    description: 'Yapay zeka destekli alışveriş desenleri ve tercih analizleri ile müşterilerinizi daha iyi anlayın.'
  },
  {
    icon: <Shield className="h-6 w-6 text-indigo-600" />,
    title: 'Güvenli ve Güvenilir',
    description: 'Kurumsal düzeyde güvenlik ile verileriniz her zaman korunur ve ihtiyacınız olduğunda erişilebilir.'
  }
];

const Features: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px"
  });

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            İşletmeniz İçin Güçlü Özellikler
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Trendyol'da başarılı olmak için ihtiyacınız olan her şey, tek bir yerde
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;