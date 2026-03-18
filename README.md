# 💰 Money Tracker - Student Daily Logger

A fast, simple, and digital expense notebook for students to track their daily spending in under 10 seconds.

## 🚀 Key Features
- **10-Second Logging**: Add expenses quickly with a custom numeric keypad.
- **Monthly Budgeting**: Set and track your monthly spending limit.
- **Category Analytics**: Beautifully visualized insights by category.
- **Real-time Sync**: Powered by Supabase for instantaneous data updates across devices.
- **Glassmorphic UI**: Premium, modern design with smooth animations.

## 🛠️ Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Animations**: Framer Motion
- **Database/Auth**: Supabase
- **Icons**: Lucide React
- **Dates**: Day.js

## 💻 Local Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/shivateja-915/moneytracker-.git
    cd moneytracker-
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root and add:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🌍 Vercel Deployment

This project is pre-configured for Vercel deployment.

1.  Connect your GitHub repository to Vercel.
2.  **Add Environment Variables**: In the Vercel project settings, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3.  **Routing**: The `vercel.json` file handles all client-side routing redirects.
4.  **Supabase Configuration**: Add your production Vercel URL to the Supabase Authentication > URL Configuration settings.

---
Built with ❤️ by AI Assistant for @shivateja-915.
