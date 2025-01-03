import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useInView } from 'framer-motion';


const testimonials = [
  {
    name: 'Ayşe Yılmaz',
    role: 'E-ticaret Müdürü',
    company: 'Moda Butik',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'Quantiq, Trendyol mağazamızı yönetme şeklimizi tamamen değiştirdi. Analitikler inanılmaz ve kullanmaya başladığımızdan beri satışlarımız %40 arttı.'
  },
  {
    name: 'Mehmet Can',
    role: 'CEO',
    company: 'Teknoloji Market',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'Quantiq\'ten aldığımız müşteri içgörüleri paha biçilemez. 7/24 bir veri bilimcisine sahip olmak gibi.'
  },
  {
    name: 'Elif Demir',
    role: 'Dijital Pazarlama Direktörü',
    company: 'Yaşam Tarzı Markası',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'Entegrasyon sorunsuzdu ve destek ekibi harika. Quantiq, e-ticaret stratejimizin vazgeçilmez bir parçası haline geldi.'
  }
];

const Testimonials: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
      once: true,
      margin: "0px"
    });

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Quantiq'e güvenen binlerce memnun satıcıya katılın
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full mr-4"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;