/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './shared/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A73E8',
          dark: '#1557B0',
          light: '#4A90D9',
        },
        secondary: {
          DEFAULT: '#34A853',
          dark: '#1E7E34',
        },
        danger: '#EA4335',
        warning: '#FBBC04',
        surface: '#F8F9FA',
        border: '#E8EAED',
        muted: '#9AA0A6',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
