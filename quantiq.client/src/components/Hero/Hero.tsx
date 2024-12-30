import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import DashboardPreview from '../DashboardPreview/DashboardPreview';


const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-indigo-600 dark:text-indigo-400"> Quantiq </span>
              E-Ticaret Çözümleri ile İşletmenizi Büyütün
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Yapay zeka destekli araçlar ile e-ticaret işinizi analiz edin, optimize edin ve ölçeklendirin
            </p>
            
            <motion.div 
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 lg:static lg:translate-x-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button className="inline-flex items-center px-12 py-4 text-lg font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                Try For Free
                <ArrowRight className="ml-2" size={24} />
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;