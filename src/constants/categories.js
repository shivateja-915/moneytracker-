import { 
  Utensils, Bus, ShoppingBag, Film, FileText, 
  HeartPulse, GraduationCap, Home, Plane, Gift, Sparkles, 
  Smartphone, Wallet, Coffee
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'Food', label: 'Food', icon: Utensils, emoji: '🍔', color: '#FF7A50' },
  { id: 'Transport', label: 'Transport', icon: Bus, emoji: '🚌', color: '#00D094' },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, emoji: '🛍️', color: '#BD71FF' },
  { id: 'Entertainment', label: 'Entertainment', icon: Film, emoji: '🎬', color: '#FFD02C' },
  { id: 'Bills', label: 'Bills', icon: FileText, emoji: '📄', color: '#FF5B5B' },
  { id: 'Health', label: 'Health', icon: HeartPulse, emoji: '🏥', color: '#FF85A2' },
  { id: 'Home', label: 'Home', icon: Home, emoji: '🏠', color: '#4A90E2' },
  { id: 'Education', label: 'Education', icon: GraduationCap, emoji: '📚', color: '#F5A623' },
  { id: 'Personal', label: 'Personal', icon: Sparkles, emoji: '✨', color: '#7ED321' },
  { id: 'Travel', label: 'Travel', icon: Plane, emoji: '✈️', color: '#50E3C2' },
  { id: 'Gift', label: 'Gift', icon: Gift, emoji: '🎁', color: '#B8E986' },
  { id: 'Subscription', label: 'Subscription', icon: Smartphone, emoji: '📱', color: '#9013FE' },
  { id: 'Savings', label: 'Savings', icon: Wallet, emoji: '💰', color: '#417505' },
  { id: 'Coffee', label: 'Coffee', icon: Coffee, emoji: '☕', color: '#8B572A' }
];
