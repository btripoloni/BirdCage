/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      blue: '#1DA1F2',
      'dark-blue': '#175982',
      black: '#14171A',
      'light-black': '#1B1F23',
      'extra-light-black': '1C1F22',
      'dark-gray': '#657786',
      'light-gray': '#AAB8C2',
      'extra-light-gray': '#E1E8ED',
      white: '#ffffff'
    }
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })]
}
