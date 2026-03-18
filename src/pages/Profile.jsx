import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Save, LogOut, User as UserIcon, School, Calendar, Mail, Shield } from 'lucide-react';

export const Profile = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    college_name: '',
    monthly_limit: 50000
  });

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          name: data.name || '',
          age: data.age || '',
          college_name: data.college_name || '',
          monthly_limit: data.monthly_limit || 50000
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, fetchProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Sanitize age: empty string → null, otherwise parse as integer
      const age = profile.age === '' || profile.age === null
        ? null
        : parseInt(profile.age, 10);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          college_name: profile.college_name,
          age,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 px-4">
        <div className="w-24 h-24 bg-secondary/5 rounded-[32px] flex items-center justify-center text-secondary/20 mb-4">
          <UserIcon size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-secondary">Profile</h2>
          <p className="text-secondary/40 font-medium max-w-xs">
            Create an account to save your profile and track expenses across devices.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-28 h-28 bg-secondary text-white rounded-[40px] flex items-center justify-center text-4xl font-black shadow-2xl relative z-10">
            {initials}
          </div>
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl z-0" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-secondary tracking-tight">
            {profile.name || 'Your Profile'}
          </h2>
          <div className="flex items-center gap-2 text-secondary/40 font-bold text-xs uppercase tracking-widest justify-center">
            <Mail size={12} />
            {user.email}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-secondary/30 uppercase tracking-[0.2em] px-2">Account Details</h3>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="bg-white rounded-[32px] p-2 space-y-1 shadow-sm border border-gray-100">
            <div className="relative">
              <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-transparent border-none pl-14 pr-6 py-4 text-secondary font-bold placeholder:text-secondary/20 focus:ring-0"
                required
              />
            </div>
            <div className="h-px bg-gray-50 mx-6" />
            <div className="relative">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20" size={20} />
              <input
                type="number"
                placeholder="Age"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                className="w-full bg-transparent border-none pl-14 pr-6 py-4 text-secondary font-bold placeholder:text-secondary/20 focus:ring-0"
              />
            </div>
            <div className="h-px bg-gray-50 mx-6" />
            <div className="relative">
              <School className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/20" size={20} />
              <input
                type="text"
                placeholder="College Name"
                value={profile.college_name}
                onChange={(e) => setProfile({ ...profile, college_name: e.target.value })}
                className="w-full bg-transparent border-none pl-14 pr-6 py-4 text-secondary font-bold placeholder:text-secondary/20 focus:ring-0"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full h-16 flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} strokeWidth={3} />}
            Save Changes
          </button>
        </form>
      </div>

      <div className="pt-4">
        <button
          onClick={() => signOut()}
          className="w-full h-16 bg-accent-red/5 text-accent-red rounded-[28px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent-red/10 transition-all border border-accent-red/10"
        >
          <LogOut size={18} strokeWidth={3} />
          Sign Out
        </button>
      </div>

      <div className="py-8 flex flex-col items-center gap-2">
         <div className="flex items-center gap-2 text-secondary/20 font-black text-[10px] uppercase tracking-widest">
            <Shield size={12} />
            Data secured by Supabase
         </div>
         <p className="text-[10px] text-secondary/10 font-bold">Version 2.4.0</p>
      </div>
    </motion.div>
  );
};

const Loader2 = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
