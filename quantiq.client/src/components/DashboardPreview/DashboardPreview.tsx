import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Package, 
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  CreditCard,
  ArrowUpRight,
  Boxes
} from 'lucide-react';

const FloatingCard = ({ children, delay, className }: { 
  children: React.ReactNode; 
  delay: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center gap-3 hover:scale-105 transition-transform ${className}`}
  >
    {children}
  </motion.div>
);

const DashboardPreview: React.FC = () => {
  return (
    <div className="relative w-full h-[600px]">
      <FloatingCard delay={0.2} className="top-4 left-4 -rotate-3">
        <ShoppingBag className="w-8 h-8 text-green-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Satış</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">₺124,563</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.3} className="top-4 right-4 rotate-3">
        <Package className="w-8 h-8 text-blue-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ürün</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">1,234</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.4} className="top-32 left-32 rotate-2">
        <TrendingUp className="w-8 h-8 text-purple-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Büyüme</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">+27%</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.5} className="top-32 right-32 -rotate-2">
        <Users className="w-8 h-8 text-orange-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Müşteri</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">5,678</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.6} className="top-[240px] left-8 -rotate-1">
        <ShoppingCart className="w-8 h-8 text-pink-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sipariş</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">892</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.7} className="top-[240px] right-8 rotate-1">
        <Activity className="w-8 h-8 text-cyan-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Destek</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">3.2%</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.8} className="top-[360px] left-20 rotate-3">
        <CreditCard className="w-8 h-8 text-emerald-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">İşlem</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">2,431</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={0.9} className="top-[360px] right-40 -rotate-3">
        <ArrowUpRight className="w-8 h-8 text-yellow-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Kâr</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">+18%</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={1} className="top-[480px] left-20 -rotate-2">
        <DollarSign className="w-8 h-8 text-indigo-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Kazanç</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">₺89,321</p>
        </div>
      </FloatingCard>

      <FloatingCard delay={1.1} className="top-[480px] right-20 rotate-2">
        <Boxes className="w-8 h-8 text-red-500" />
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Stok</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">4,523</p>
        </div>
      </FloatingCard>
    </div>
  );
};

export default DashboardPreview;