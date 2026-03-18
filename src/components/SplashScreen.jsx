import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

export const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-secondary flex flex-col items-center justify-center text-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center shadow-2xl relative z-10">
                <Wallet size={48} strokeWidth={3} className="text-white" />
              </div>
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl z-0 animate-pulse" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tighter mb-1">
                Money <span className="text-primary tracking-tighter">Tracker</span>
              </h1>
              <p className="text-white/40 font-bold text-[10px] uppercase tracking-[0.3em]">Smart Personal Finance</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
