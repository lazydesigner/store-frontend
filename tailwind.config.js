/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#222E3A',
        secondary: '#64748b',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#06b6d4',
        blue: {
        50:  '#f3faeb',
        100: '#e4f3d1',
        200: '#c9e7a2',
        300: '#aedb73',
        400: '#93cf45',
        500: '#7EBD4A', // PRIMARY
        600: '#6aa73f',
        700: '#568d35',
        800: '#42732b',
        900: '#2e591f',
      },
      slate: {
        50:  '#f4f6f8',
        100: '#e6eaee',
        200: '#c9d2dc',
        300: '#adb9c9',
        400: '#7b8a99',
        500: '#222E3A', // PRIMARY SLATE
        600: '#1d2833',
        700: '#18212b',
        800: '#131b22',
        900: '#0e141a',
      },
      },

      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
    },
  },
  plugins: [],
}