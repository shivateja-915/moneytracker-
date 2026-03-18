/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A50',
          dark: '#E86A45',
          light: '#FF9B7F',
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          muted: '#8E8E93',
        },
        background: {
          DEFAULT: '#F8F7F3',
          alt: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          variant: '#F2F2F7',
        },
        'on-surface': {
          DEFAULT: '#1C1C1E',
          variant: '#636366',
        },
        'accent-mint': '#00D094',
        'accent-purple': '#BD71FF',
        'accent-red': '#FF5B5B',
        'accent-yellow': '#FFD02C',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
        'full': '999px',
      },
      boxShadow: {
        'soft': '0px 10px 25px -5px rgba(0, 0, 0, 0.04), 0px 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'medium': '0px 20px 25px -5px rgba(0, 0, 0, 0.08), 0px 10px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
