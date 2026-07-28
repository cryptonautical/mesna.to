/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#aa1e22',
          dark: '#7f1117',
          light: '#e14b4f',
        },
        stone: {
          50: '#f7f2ea',
          100: '#eee6dc',
          200: '#e2d7ca',
          300: '#cbbdad',
          400: '#9e8e80',
          500: '#726459',
          600: '#574b42',
          700: '#3f3630',
          800: '#2b2420',
          900: '#1c1714',
        },
        gold: '#e6b464',
      },
    },
  },
  plugins: [],
}
