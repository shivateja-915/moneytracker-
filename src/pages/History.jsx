import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Calendar as CalendarIcon, ChevronRight, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { CATEGORIES } from '../constants/categories';
import { AuthSheet } from '../components/AuthSheet';

export const History = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('month'); // 'all' or 'month'
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (filter === 'month') {
        const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
        query = query.gte('date', startOfMonth);
      }

      const { data, error } = await query;
      if (error) throw error;
      setExpenses(data || []);
    } catch (err) {
      console.error('Error fetching history:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Analytics Calculation
  const analytics = useMemo(() => {
    const totals = {};
    let grandTotal = 0;
    
    expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount);
      grandTotal += Number(exp.amount);
    });

    return CATEGORIES
      .map(cat => ({
        ...cat,
        total: totals[cat.id] || 0,
        percentage: grandTotal > 0 ? Math.round(((totals[cat.id] || 0) / grandTotal) * 100) : 0
      }))
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  // Grouping by Date
  const groupedExpenses = useMemo(() => {
    const groups = {};
    expenses.forEach(exp => {
      if (!groups[exp.date]) {
        groups[exp.date] = {
          date: exp.date,
          total: 0,
          items: []
        };
      }
      groups[exp.date].items.push(exp);
      groups[exp.date].total += Number(exp.amount);
    });
    return Object.values(groups);
  }, [expenses]);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto text-primary">
          <TrendingDown size={48} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-secondary">History</h2>
          <p className="text-secondary/40 font-medium">Please sign in to view your transaction history.</p>
        </div>
        <button 
          onClick={() => setIsAuthSheetOpen(true)}
          className="btn-primary w-full max-w-xs"
        >
          Sign In Now
        </button>
        <AuthSheet isOpen={isAuthSheetOpen} onClose={() => setIsAuthSheetOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-secondary tracking-tight">History</h2>
        <div className="flex bg-gray-100 rounded-2xl p-1">
          {['month', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-secondary shadow-sm' : 'text-secondary/40'}`}
            >
              {f === 'month' ? 'Month' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      {analytics.length > 0 && (
        <section className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {analytics.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="bg-white rounded-[28px] p-4 flex flex-col items-center text-center space-y-2 shadow-sm border border-gray-50"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center text-2xl" style={{ backgroundColor: `${cat.color}15` }}>
                  {cat.emoji}
                </div>
                <div className="space-y-0.5 w-full">
                  <span className="text-[9px] font-black text-secondary/30 uppercase tracking-widest">{cat.label}</span>
                  <div className="text-sm font-black text-secondary leading-tight">&#8377;{cat.total.toLocaleString()}</div>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ delay: idx * 0.07 + 0.2, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                >
                  {cat.percentage}%
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* History List */}
      <section className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : groupedExpenses.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
             <CalendarIcon size={48} className="mx-auto text-secondary/10" />
             <p className="text-secondary/40 font-bold italic tracking-wide">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-10 pb-36">
            {groupedExpenses.map((group, idx) => (
              <motion.div 
                key={group.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black text-secondary uppercase tracking-[0.2em]">
                    {dayjs(group.date).format('D MMMM')}
                  </span>
                  <span className="h-px flex-1 bg-gray-100 mx-4" />
                  <span className="text-sm font-black text-primary">₹{group.total.toLocaleString()}</span>
                </div>
                
                <div className="space-y-3">
                  {group.items.map((item) => {
                    const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[5];
                    return (
                      <div key={item.id} className="bg-white rounded-[28px] p-2 pr-6 flex items-center justify-between shadow-sm border border-transparent hover:border-gray-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${cat.color}10` }}>
                            {cat.emoji}
                          </div>
                          <div>
                            <h4 className="text-secondary font-bold text-base leading-tight">₹{Number(item.amount).toLocaleString()}</h4>
                            <div className="text-[10px] font-black text-secondary/30 uppercase tracking-widest">
                              {cat.label} {item.note ? `• ${item.note}` : ''}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-secondary/20 uppercase tracking-widest">
                          {dayjs(item.created_at).format('h:mm A')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <AuthSheet isOpen={isAuthSheetOpen} onClose={() => setIsAuthSheetOpen(false)} />
    </div>
  );
};
