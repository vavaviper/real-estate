/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f6',
          100: '#ffe4ec',
          200: '#ffcce0',
          300: '#ffa6c7',
          400: '#ff7fb0',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', ' -apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial'],
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};