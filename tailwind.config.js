/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter Variable"', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50: '#f3f0ff', 100: '#e9e3ff', 200: '#d4c9ff', 500: '#7c5cff',
          600: '#6a45f5', 700: '#5834d6',
        },
        ink: { DEFAULT: '#14121f', soft: '#4b4a5c', muted: '#8a8999' },
        canvas: '#f6f6f9',
        line: '#e4e4ec',
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem' },
      boxShadow: { card: '0 1px 2px rgb(20 18 31 / 0.05)' },
    },
  },
  plugins: [],
}
