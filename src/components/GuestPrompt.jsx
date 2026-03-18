import { LogIn, UserPlus } from 'lucide-react';

export const GuestPrompt = ({ onAuth }) => (
  <div className="bg-primary-container p-6 rounded-m3-lg space-y-4 border border-primary/10">
    <div className="space-y-1">
      <h3 className="text-primary-on-container font-medium text-lg">Sign in to save expenses</h3>
      <p className="text-primary-on-container/70 text-sm">
        It's free and takes 10 seconds. Join over 1,000 students using Daily Logger.
      </p>
    </div>
    <div className="flex gap-3 pt-2">
      <button 
        onClick={onAuth}
        className="m3-filled-button flex-1 flex items-center justify-center gap-2"
      >
        <UserPlus size={18} />
        Sign Up
      </button>
      <button 
        onClick={onAuth}
        className="m3-tonal-button flex-1 flex items-center justify-center gap-2"
      >
        <LogIn size={18} />
        Log In
      </button>
    </div>
  </div>
);
