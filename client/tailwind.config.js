/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Electric enterprise blue
          600: '#2563eb', // Linear / Stripe blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        darkbg: {
          DEFAULT: '#0B0F17',
          card: '#111827',
          cardHover: '#162032',
          border: '#1F2937',
          subtle: '#0F1623',
        },
        lightbg: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          cardHover: '#F1F5F9',
          border: '#E2E8F0',
          subtle: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'card-dark-hover': '0 12px 30px -5px rgba(0, 0, 0, 0.55)',
        'dropdown': '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
