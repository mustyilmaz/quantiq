import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'QUA FREE',
    price: '0',
    period: '1 gün',
    description: 'Quantiq hızını keşfetmek için',
    features: [
      'Temel Trendyol entegrasyonu',
      'Gerçek zamanlı stok senkronizasyonu',
      'Temel analiz paneli',
      '7/24 destek',
      '100 ürüne kadar'
    ],
    buttonText: 'Ücretsiz Dene',
    highlighted: false
  },
  {
    name: 'QUA PLUS',
    price: '500',
    period: 'ay',
    description: 'Büyüyen işletmeler için ideal',
    features: [
      'Gelişmiş Trendyol entegrasyonu',
      'Gerçek zamanlı stok senkronizasyonu',
      'Gelişmiş analiz paneli',
      'Öncelikli 7/24 destek',
      '1000 ürüne kadar',
      'Müşteri davranış analizleri',
      'Satış tahminleri'
    ],
    buttonText: 'İşletmemi Uçur 🚀',
    highlighted: true
  },
  {
    name: 'QUA PRO',
    price: '1000',
    period: 'ay',
    description: 'Büyük ölçekli operasyonlar için',
    features: [
      'Özel Trendyol entegrasyonu',
      'Gerçek zamanlı stok senkronizasyonu',
      'Özel analiz paneli',
      'Özel destek ekibi',
      'Sınırsız ürün',
      'Gelişmiş yapay zeka analizleri',
      'Özel raporlama',
      'API erişimi'
    ],
    buttonText: 'Satış Ekibiyle Görüş',
    highlighted: false
  }
];

const Pricing: React.FC = () => {
  
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px"
  });

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Basit, Şeffaf Fiyatlandırma
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ücretsiz başlayın, büyüdükçe ölçeklendirin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative rounded-2xl ${
                plan.highlighted
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-600 ring-opacity-50'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              } shadow-xl p-8`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-200 px-2 py-1 text-xs font-semibold text-indigo-700">
                    <Zap className="h-3 w-3" />
                    Popüler
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>{plan.name}</h3>
                <p className={`${
                  plan.highlighted ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                }`}>{plan.description}</p>
              </div>
              <div className="mb-8">
                <p className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}₺</span>
                  <span className={`text-sm ${
                    plan.highlighted ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>/{plan.period}</span>
                </p>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 ${
                      plan.highlighted ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'
                    }`} />
                    <span className={plan.highlighted ? 'text-indigo-100' : 'text-gray-700 dark:text-gray-300'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button className={`w-full rounded-lg px-4 py-2 text-center text-sm font-semibold transition-all ${
                plan.highlighted
                  ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;