/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f2',
          100: '#ffe8e1',
          200: '#ffd4c7',
          300: '#ffb39e',
          400: '#fa8060',
          500: '#e0411b', // Primary Terracotta
          600: '#c8320e',
          700: '#a62408',
          800: '#871e09',
          900: '#6f1d0d',
        },
        delivery: {
          50: '#f0f6fe',
          100: '#e9f1ff',
          500: '#005ac1',
          600: '#00469b',
          700: '#003679',
        },
        surface: {
          ground: '#fef7f4',
          card: '#ffffff',
          muted: '#f5eeea',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
