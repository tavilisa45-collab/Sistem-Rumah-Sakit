/** @type {import('tailwindcss').Config} */

const tailwindConfig = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fc',
          100: '#ecf0f9',
          200: '#d9e2f3',
          300: '#c5d3ed',
          400: '#9bb5df',
          500: '#6d8fd4',
          600: '#1F2B6C',
          700: '#1a2459',
          800: '#151d46',
          900: '#0f1633',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
export default tailwindConfig;
