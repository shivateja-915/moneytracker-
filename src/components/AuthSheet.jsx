import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

export const AuthSheet = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn({ email, password });
        if (error) throw error;
      } else {
        const { error } = await signUp({ email, password, options: { data: { email } } });
        if (error) throw error;
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white z-[101] rounded-t-[40px] p-8 pb-12 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <h2 className="text-3xl font-black text-secondary tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Get Started'}
                  </h2>
                  <Sparkles size={20} className="text-secondary/20" />
                </div>
                <p className="text-secondary/40 font-bold text-xs uppercase tracking-widest">{isLogin ? 'Nice to see you again!' : 'Track your wealth with us.'}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-secondary/20 hover:text-secondary hover:bg-gray-100 transition-all active:scale-90"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 rounded-[32px] p-2 space-y-1 shadow-inner">
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20" size={20} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none pl-14 pr-6 py-4 text-secondary font-bold placeholder:text-secondary/20 focus:ring-0"
                    required
                  />
                </div>
                <div className="h-px bg-white mx-6" />
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20" size={20} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-none pl-14 pr-6 py-4 text-secondary font-bold placeholder:text-secondary/20 focus:ring-0"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-accent-red/5 p-4 rounded-2xl border border-accent-red/10">
                  <p className="text-accent-red text-xs font-bold uppercase tracking-wider text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-16 flex items-center justify-center gap-2 text-xl shadow-xl shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Log In' : 'Create Account')}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-secondary/40 text-xs font-black uppercase tracking-[0.2em] hover:text-primary transition-colors py-2"
                >
                  {isLogin ? "Join the family →" : "Already have an account? Log In »"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
