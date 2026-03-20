import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Loader2, Calendar, ChevronRight, X, Delete, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { CATEGORIES } from '../constants/categories';
import { AuthSheet } from '../components/AuthSheet';

const AddExpenseModal = ({ isOpen, onClose, onSave, isSaving }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const primaryIds = ['Food', 'Transport', 'Bills', 'Entertainment'];
  const primaryCategories = CATEGORIES.filter(c => primaryIds.includes(c.id));
  const otherCategories = CATEGORIES.filter(c => !primaryIds.includes(c.id));

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    if (isOpen) {
      setShowAllCategories(false);
    }
    setPrevIsOpen(isOpen);
  }

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

  const handleKeypress = useCallback((key) => {
    if (key === 'del') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + '.');
    } else {
      if (amount.split('.')[1]?.length >= 2) return;
      setAmount(prev => prev + key);
    }
  }, [amount]);

  const handleSubmit = useCallback(() => {
    if (!amount || parseFloat(amount) <= 0) return;
    onSave({ amount, category: category.id, note, date: dayjs().format('YYYY-MM-DD') });
    setAmount('');
    setNote('');
    onClose();
  }, [amount, category.id, note, onSave, onClose]);

  // Physical keyboard support
  useEffect(() => {
    if (!isOpen) return;
    const handlePhysicalKey = (e) => {
      // Don't intercept when typing in the note input
      if (e.target.tagName === 'INPUT') return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeypress(e.key);
      } else if (e.key === 'Backspace') {
        handleKeypress('del');
      } else if (e.key === '.') {
        handleKeypress('.');
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  }, [isOpen, handleKeypress, handleSubmit]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden"
        >
          <div className="p-6 flex items-center justify-between">
            <button onClick={onClose} className="p-2 -ml-2 text-secondary/40 hover:text-secondary">
              <X size={24} />
            </button>
            <h2 className="text-lg font-bold text-secondary">Add Transaction</h2>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain flex flex-col px-8 pt-4">
            <div className="flex flex-col items-center mb-8">
              <span className="text-secondary/40 text-sm font-medium mb-2 uppercase tracking-widest">Enter Amount</span>
              <div className="flex items-baseline gap-2">
                <span className="text-primary font-black text-2xl">₹</span>
                <span className="text-6xl font-black text-secondary tracking-tight">
                  {amount || '0'}
                  <span className="animate-pulse text-primary ml-1">|</span>
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-4 gap-3">
                {primaryCategories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat);
                      setShowAllCategories(false);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${category.id === cat.id ? 'bg-primary/10 ring-2 ring-primary/20' : 'bg-gray-50'}`}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${category.id === cat.id ? 'text-primary' : 'text-secondary/40'}`}>
                      {cat.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {showAllCategories && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-4 gap-3 pt-2"
                  >
                    {otherCategories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setCategory(cat)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${category.id === cat.id ? 'bg-primary/10 ring-2 ring-primary/20' : 'bg-gray-50'}`}
                      >
                        <span className="text-xl">{cat.emoji}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${category.id === cat.id ? 'text-primary' : 'text-secondary/40'}`}>
                          {cat.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full py-3 bg-gray-50 rounded-2xl flex items-center justify-center gap-2 text-secondary/40 hover:text-secondary group transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {showAllCategories ? 'Show Less' : 'More Categories'}
                </span>
                <ChevronRight size={14} className={`transition-transform duration-300 ${showAllCategories ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            </div>

            <input 
              type="text"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-secondary font-medium focus:ring-2 focus:ring-primary/20 transition-all mb-8"
            />

            {/* Numeric Keypad */}
            <div className="mt-auto grid grid-cols-3 gap-2 pb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'del'].map((key) => (
                <button
                  key={key}
                  onClick={() => key === 'del' ? handleKeypress('del') : handleKeypress(key.toString())}
                  className="h-16 flex items-center justify-center text-2xl font-bold text-secondary hover:bg-gray-100 rounded-2xl transition-colors active:scale-95"
                >
                  {key === 'del' ? <Delete size={24} /> : key}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSaving || !amount}
              className="w-full h-16 bg-primary text-white rounded-[24px] font-black text-xl shadow-xl shadow-primary/20 mb-8 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <Plus size={24} strokeWidth={3} />}
              Save Transaction
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const EditLimitModal = ({ isOpen, onClose, onSave, currentLimit }) => {
  const [limit, setLimit] = useState(currentLimit.toString());

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    if (isOpen) setLimit(currentLimit.toString());
    setPrevIsOpen(isOpen);
  }

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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (limit && parseFloat(limit) > 0) {
      onSave(parseFloat(limit));
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[400px] bg-white rounded-[40px] p-8 shadow-2xl flex flex-col"
          >
            <h2 className="text-2xl font-black text-secondary mb-2">Monthly Limit</h2>
            <p className="text-secondary/40 font-bold text-xs uppercase tracking-widest mb-8">Set your spending goals</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 rounded-[32px] p-6 flex items-center gap-4 border border-gray-100">
                <span className="text-primary font-black text-3xl">₹</span>
                <input 
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full bg-transparent border-none text-4xl font-black text-secondary focus:ring-0 p-0 placeholder:text-gray-200"
                  placeholder="0"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-16 bg-gray-50 text-secondary/40 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[1.5] h-16 bg-primary text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const LimitReachedModal = ({ isOpen, onClose, totalMonth, monthlyLimit }) => {
  const overBy = totalMonth - monthlyLimit;
  const percent = Math.round((totalMonth / monthlyLimit) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="relative w-full max-w-[400px] bg-white rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Red gradient header */}
            <div className="bg-gradient-to-br from-red-500 to-rose-600 p-8 pb-10 flex flex-col items-center text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                className="w-20 h-20 bg-white/20 rounded-[28px] flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30"
              >
                <AlertTriangle size={36} strokeWidth={2.5} className="text-white" />
              </motion.div>
              <h2 className="text-2xl font-black tracking-tight mb-1">Limit Exceeded!</h2>
              <p className="text-white/70 text-sm font-medium text-center">
                You&apos;ve used <span className="text-white font-black">{percent}%</span> of your monthly budget
              </p>
            </div>

            {/* Stats */}
            <div className="-mt-5 mx-6 bg-white rounded-[28px] shadow-lg border border-gray-100 p-5 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-[20px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/30 mb-1">Monthly Limit</span>
                <span className="text-xl font-black text-secondary">₹{monthlyLimit.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-red-50 rounded-[20px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Total Spent</span>
                <span className="text-xl font-black text-red-500">₹{totalMonth.toLocaleString()}</span>
              </div>
            </div>

            {/* Message */}
            <div className="px-8 pt-6 pb-2">
              <div className="flex items-start gap-3 bg-red-50 rounded-[20px] p-4 border border-red-100">
                <TrendingUp size={18} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-500 text-sm font-semibold leading-relaxed">
                  {overBy > 0
                    ? `You&apos;ve overspent by ₹${overBy.toLocaleString()}. No new transactions can be added until next month or your limit is increased.`
                    : `You&apos;ve reached your monthly limit. Increase your limit to continue adding transactions.`
                  }
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-14 bg-gray-50 text-secondary/50 rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalToday, setTotalToday] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [userName, setUserName] = useState('');
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditLimitOpen, setIsEditLimitOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLimitNoticeOpen, setIsLimitNoticeOpen] = useState(false);
  const prevLimitReachedRef = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');

      // Fetch expenses and profile limit in parallel
      const [expensesRes, profileRes] = await Promise.all([
        supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startOfMonth)
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('monthly_limit, name')
          .eq('id', user.id)
          .single()
      ]);

      if (expensesRes.error) throw expensesRes.error;
      
      const data = expensesRes.data || [];
      const todayExps = data.filter(e => e.date === today);
      setExpenses(todayExps);
      setMonthlyExpenses(data);
      setTotalToday(todayExps.reduce((sum, exp) => sum + Number(exp.amount), 0));
      setTotalMonth(data.reduce((sum, exp) => sum + Number(exp.amount), 0));

      if (profileRes.data?.monthly_limit !== undefined) {
        setMonthlyLimit(profileRes.data.monthly_limit || 0);
      }
      // Set name even if empty string so we always have the latest value
      setUserName(profileRes.data?.name || '');
    } catch (err) {
      console.error('Error fetching dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Re-fetch whenever the page becomes visible (e.g. user navigates back from Profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchDashboardData]);

  // Realtime subscription: re-fetch profile name when it's updated
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`profile-name-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          if (payload.new?.name !== undefined) {
            setUserName(payload.new.name || '');
          }
          if (payload.new?.monthly_limit !== undefined) {
            setMonthlyLimit(payload.new.monthly_limit);
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const handleUpdateLimit = async (newLimit) => {
    setMonthlyLimit(newLimit);
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ monthly_limit: newLimit })
        .eq('id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating limit:', err.message);
    }
  };

  const isLimitReached = monthlyLimit > 0 && totalMonth >= monthlyLimit;

  // Auto-show popup the moment limit is first exceeded
  useEffect(() => {
    if (isLimitReached && !prevLimitReachedRef.current) {
      setIsLimitNoticeOpen(true);
    }
    prevLimitReachedRef.current = isLimitReached;
  }, [isLimitReached]);

  const handleSaveExpense = async (expenseData) => {
    if (!user) {
      setIsAuthSheetOpen(true);
      return;
    }

    // Block if monthly limit is already reached
    if (isLimitReached) {
      setIsLimitNoticeOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          user_id: user.id,
          ...expenseData
        }])
        .select()
        .single();

      if (error) throw error;
      
      setExpenses([data, ...expenses]);
      setMonthlyExpenses(prev => [data, ...prev]);
      setTotalToday(prev => prev + Number(data.amount));
      setTotalMonth(prev => prev + Number(data.amount));
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, expAmount) => {
    try {
      setExpenses(expenses.filter(e => e.id !== id));
      setMonthlyExpenses(prev => prev.filter(e => e.id !== id));
      setTotalToday(prev => prev - Number(expAmount));
      setTotalMonth(prev => prev - Number(expAmount));

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch {
      fetchDashboardData();
    }
  };

  return (
    <div className="space-y-6">
      {/* User Greeting Section */}
      {user && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col py-2"
        >
          <span className="text-secondary/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Welcome back</span>
          <h2 className="text-2xl font-black text-secondary tracking-tight">
            Hi, {userName ? userName.split(' ')[0] : 'there'} 👋
          </h2>
        </motion.div>
      )}

      {/* Monthly Stats Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-secondary rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16" />
        
        <div className="relative space-y-6">
          {/* Monthly Limit Row */}
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setIsEditLimitOpen(true)}>
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Add your monthly limit</span>
              <div className="flex items-baseline gap-1">
                <span className="text-white/60 text-sm font-bold">₹</span>
                <span className="text-xl font-black">{monthlyLimit.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Plus size={18} strokeWidth={3} className="text-white rotate-45" />
            </div>
          </div>

          {/* Monthly Spent Row */}
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Monthly Spent</span>
              <div className="flex items-baseline gap-2">
                <span className="text-white/40 text-xl font-medium">₹</span>
                <h2 className="text-4xl font-black tracking-tight">{totalMonth.toLocaleString()}</h2>
              </div>
            </div>
          </div>

          {/* Remaining Funds Row */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Remaining Funds</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-primary text-2xl font-black">₹</span>
                <span className={`text-3xl font-black ${(monthlyLimit - totalMonth) < 0 ? 'text-accent-red' : 'text-white'}`}>
                  {(monthlyLimit - totalMonth).toLocaleString()}
                </span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="flex-1 max-w-[100px] h-2 bg-white/10 rounded-full overflow-hidden ml-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalMonth / monthlyLimit) * 100)}%` }}
                className={`h-full rounded-full ${totalMonth > monthlyLimit ? 'bg-accent-red' : 'bg-primary'}`}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {/* Today's Transactions Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[32px] p-6 shadow-medium flex flex-col items-center justify-center border border-gray-50 active:scale-95 transition-all text-center cursor-default"
        >
          <span className="text-secondary/40 text-[10px] font-black uppercase tracking-widest mb-1">Today</span>
          <div className="flex items-baseline gap-1">
            <span className="text-secondary/40 text-xs font-bold">₹</span>
            <h3 className="text-3xl font-black text-secondary tracking-tighter">
              {totalToday.toLocaleString()}
            </h3>
          </div>
        </motion.div>

        {/* Add Transaction Button */}
        {isLimitReached ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => setIsLimitNoticeOpen(true)}
            className="flex flex-col items-center justify-center bg-red-50 rounded-[32px] border-2 border-red-100 p-6 active:scale-95 transition-all group"
          >
            <AlertTriangle size={24} className="text-red-500 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-red-500 text-[9px] font-black uppercase tracking-widest leading-tight text-center">Limit Reached</span>
          </motion.button>
        ) : (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary rounded-[32px] p-6 flex flex-col items-center justify-center text-white shadow-xl shadow-primary/30 active:scale-95 transition-all group overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={28} strokeWidth={3} className="mb-1 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-tight">Add Transaction</span>
          </motion.button>
        )}
      </div>

      {/* Monthly Category Breakdown */}
      {monthlyExpenses.length > 0 && (() => {
        // Group by category and sum
        const catMap = {};
        monthlyExpenses.forEach(exp => {
          if (!catMap[exp.category]) catMap[exp.category] = 0;
          catMap[exp.category] += Number(exp.amount);
        });
        const sorted = Object.entries(catMap)
          .map(([id, total]) => ({ id, total, cat: CATEGORIES.find(c => c.id === id) }))
          .filter(x => x.cat)
          .sort((a, b) => b.total - a.total);
        const grandTotal = sorted.reduce((s, x) => s + x.total, 0);

        return (
          <div>
            <h3 className="text-xs font-black text-secondary/30 uppercase tracking-[0.2em] px-2 pb-3">This Month by Category</h3>
            <div className="grid grid-cols-3 gap-3">
              {sorted.map(({ id, total, cat }, i) => {
                const pct = Math.round((total / grandTotal) * 100);
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-[28px] p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-50"
                  >
                    <div
                      className="w-12 h-12 rounded-[18px] flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${cat.color}18` }}
                    >
                      {cat.emoji}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary/30 text-center">{cat.label}</span>
                    <span className="text-sm font-black text-secondary leading-none">₹{total.toLocaleString()}</span>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                    >
                      {pct}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })()}
      <h3 className="text-xs font-black text-secondary/30 uppercase tracking-[0.2em] px-2 pt-4">Today&apos;s Transactions</h3>

      {/* Transaction List */}
      <div className="space-y-3 pb-36">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {expenses.map((exp, index) => {
              const cat = CATEGORIES.find(c => c.id === exp.category) || CATEGORIES[5];
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-[32px] p-2 pr-6 flex items-center justify-between group border border-transparent hover:border-gray-100 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-[24px] flex items-center justify-center text-2xl shadow-inner bg-opacity-10`} style={{ backgroundColor: `${cat.color}20` }}>
                      {cat.emoji}
                    </div>
                    <div>
                      <h4 className="text-secondary font-bold text-base leading-tight">{cat.label}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-secondary/30 text-[10px] uppercase font-bold tracking-wider">{dayjs(exp.created_at).format('h:mm A')}</span>
                        {exp.note && (
                          <>
                            <span className="text-secondary/20">•</span>
                            <span className="text-secondary/40 text-xs font-medium max-w-[120px] truncate">{exp.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-secondary font-black text-lg">-₹{Number(exp.amount).toLocaleString()}</span>
                    <button
                      onClick={() => handleDelete(exp.id, exp.amount)}
                      className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-secondary/20 hover:text-accent-red hover:bg-accent-red/5 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            {expenses.length === 0 && (
              <div className="py-20 text-center opacity-30 select-none">
                <p className="font-black text-2xl mb-2">Clean Slate!</p>
                <p className="text-sm font-medium">No expenses recorded for today.</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveExpense}
        isSaving={isSaving}
      />
      <EditLimitModal
        isOpen={isEditLimitOpen}
        onClose={() => setIsEditLimitOpen(false)}
        onSave={handleUpdateLimit}
        currentLimit={monthlyLimit}
      />
      <AuthSheet isOpen={isAuthSheetOpen} onClose={() => setIsAuthSheetOpen(false)} />
      <LimitReachedModal
        isOpen={isLimitNoticeOpen}
        onClose={() => setIsLimitNoticeOpen(false)}
        totalMonth={totalMonth}
        monthlyLimit={monthlyLimit}
      />
    </div>
  );
};
