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
          DEFAULT: '#a3121d',
          dark: '#6f0c15',
          light: '#c32c35',
        },
        stone: {
          50: '#f8f1e8',
          100: '#f0e3d6',
          300: '#d8c7ae',
          600: '#4a3d34',
          900: '#16100d',
        },
        gold: '#f3c776',
      },
      boxShadow: {
        card: '0 18px 50px -20px rgba(16, 16, 16, 0.45)',
        glow: '0 0 0 1px rgba(163, 18, 29, 0.15), 0 25px 60px -35px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(22,16,13,0.14) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}

