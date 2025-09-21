/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#fdfcfb',
          100: '#f9f6f3',
          200: '#f2ede6',
          300: '#e8ddd1',
          400: '#dcc9b8',
          500: '#d1b59f',
          600: '#c4a085',
          700: '#b8936b',
          800: '#a67c52',
          900: '#8b5a3a',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf2e6',
          300: '#f6e8d1',
          400: '#f0d9b5',
          500: '#e8c896',
          600: '#deb574',
          700: '#d19e4f',
          800: '#b8853f',
          900: '#9a6f35',
        },
      },
    },
  },
  plugins: [],
}