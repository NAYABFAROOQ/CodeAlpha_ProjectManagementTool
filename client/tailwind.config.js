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
        // Emerald & Amber Brand system (NO purple, NO blue, NO black)
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Vibrant Emerald
          600: '#059669', // Rich Forest Jade
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Warm Amber Gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // Vibrant Coral Rose
          600: '#e11d48',
          700: '#be123c',
        },
        // Deep Pine & Forest Charcoal Dark Theme (NOT black, NOT blue, NOT purple)
        darkbg: {
          DEFAULT: '#0a1a14', // Deep pine forest
          card: '#11251e',
          cardHover: '#183329',
          border: '#1e3d32',
          subtle: '#0e221a',
        },
        lightbg: {
          DEFAULT: '#faf8f5', // Warm ivory silk
          card: '#ffffff',
          cardHover: '#f4efe8',
          border: '#e7ded3',
          subtle: '#f7f3ec',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 25px -5px rgba(16, 185, 129, 0.15), 0 8px 10px -6px rgba(245, 158, 11, 0.1)',
        'card-dark-hover': '0 12px 30px -5px rgba(16, 185, 129, 0.25)',
        'dropdown': '0 20px 25px -5px rgba(10, 26, 20, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.35)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.35)',
      },
    },
  },
  plugins: [],
};
