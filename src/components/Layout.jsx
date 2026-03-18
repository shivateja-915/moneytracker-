import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, History, User, LogIn, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthSheet } from './AuthSheet';
import { useState } from 'react';

export const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="app-container w-full flex flex-col shadow-2xl bg-white relative">
        {/* Top App Bar - Simple and Clean */}
        <header className="px-6 h-20 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary/40">App Name</span>
            <Link to="/" className="flex items-center gap-1">
              <h1 className="text-xl font-extrabold tracking-tight text-secondary">
                Money <span className="text-primary">Tracker</span>
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {!user ? (
              <button 
                onClick={() => setIsAuthSheetOpen(true)}
                className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-all hover:bg-primary/20 active:scale-90"
              >
                <LogIn size={20} />
              </button>
            ) : (
              <Link
                to="/profile"
                className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-white font-bold shadow-lg overflow-hidden transform transition-transform hover:scale-110"
              >
                {user.email?.[0].toUpperCase() || 'U'}
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-28 pt-4">
          <div className="px-6 max-w-full">
            <Outlet />
          </div>
        </main>

        {/* Bottom Navigation - Distinctive and Floating Style */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[432px] h-20 bg-secondary rounded-[32px] flex items-center justify-around px-8 z-50 shadow-2xl">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className="relative flex flex-col items-center justify-center group"
              >
                <div className={`relative z-10 p-2 rounded-2xl transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-white/40 group-hover:text-white'}`}>
                  <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                  {isActive && (
                    <motion.div 
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-primary/20 blur-lg rounded-full"
                    />
                  )}
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="nav-dot"
                    className="w-1.5 h-1.5 bg-primary rounded-full mt-1"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <AuthSheet isOpen={isAuthSheetOpen} onClose={() => setIsAuthSheetOpen(false)} />
      </div>
    </div>
  );
};
