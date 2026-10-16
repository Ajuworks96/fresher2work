/** @type {import('tailwindcss').Config} */
const path = require('path');

module.exports = {
  content: [
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/admin-web/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-tokens/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edfbf9',
          100: '#d5f7f4',
          200: '#aef0e9',
          300: '#65ded5',
          400: '#4ad1c7',
          500: '#3e7aa7',
          600: '#1f357c',
          700: '#192c67',
          800: '#142251',
          900: '#0c1633',
        },
        navy: {
          50: '#eef3fc',
          100: '#d9e4f9',
          500: '#1f357c',
          600: '#192c67',
          700: '#142251',
          800: '#0e183a',
          900: '#0c1633',
        },
        ocean: {
          500: '#3e7aa7',
          600: '#316489',
        },
        tealAccent: {
          400: '#65ded5',
          500: '#4ad1c7',
          600: '#2fb9af',
        },
      },
    },
  },
  plugins: [],
};
