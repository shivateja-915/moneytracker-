import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = isLogin 
        ? await signIn({ email, password })
        : await signUp({ email, password });

      if (authError) throw authError;
      
      // On sign up, supabase might send a confirmation email. Handle that visually if needed.
      if (!isLogin) {
         setError('Check your email for the confirmation link to complete registration.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center max-w-md mx-auto bg-dark-950 px-6 sm:rounded-3xl sm:my-8 sm:h-[calc(100vh-4rem)] sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:border sm:border-dark-800/50 relative overflow-hidden app-fade-in font-sans">
      {/* Dynamic background gradients */}
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px] z-0"></div>
      <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-primary-900/10 rounded-full blur-[100px] z-0"></div>
      
      <div className="relative z-10 w-full max-w-sm mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-dark-900 border border-dark-800 shadow-2xl mb-6 text-primary-500 transform hover:rotate-12 transition-transform duration-500">
            <BookOpen size={36} strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {isLogin ? 'Welcome back' : 'Join the club'}
          </h2>
          <p className="text-dark-400 font-medium text-sm">
            Master your money with clinical precision.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card px-8 py-10 rounded-[2.5rem]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-dark-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-dark-800 bg-dark-950/50 focus:bg-dark-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-white placeholder:text-dark-700"
                placeholder="you@email.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-dark-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-dark-800 bg-dark-950/50 focus:bg-dark-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-white placeholder:text-dark-700"
                placeholder="••••••••"
              />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 text-sm text-primary-400 bg-primary-950/20 border border-primary-900/30 p-4 rounded-2xl overflow-hidden"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="leading-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2 h-14"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : (
                <span className="text-lg tracking-wide font-bold">{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-dark-800 pt-6">
            <span className="text-dark-500 text-sm font-medium">
              {isLogin ? "New here? " : "Back to base? "}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-500 font-bold text-sm hover:text-primary-400 transition-colors underline decoration-2 underline-offset-4"
            >
              {isLogin ? 'Create an account' : 'Log in here'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
