import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const news = [
  "🚀 New: Trendyol integration now 10x faster!",
  "💡 Analyze customer behavior in real-time",
  "🎉 Join our webinar: Maximizing E-commerce Success",
  "📈 New AI-powered analytics features released"
];

const NewsStrip: React.FC = () => {
  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 w-full z-20 bg-indigo-600 text-white h-10 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNews}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium"
        >
          {news[currentNews]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NewsStrip;