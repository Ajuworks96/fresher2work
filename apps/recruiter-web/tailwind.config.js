/** @type {import('tailwindcss').Config} */
const path = require('path');

module.exports = {
  content: [
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/recruiter-web/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-tokens/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#f0f7fb',
          100: '#dcedf6',
          200: '#b5caf3',
          300: '#8dc1e3',
          400: '#4ad1c7', // Vibrant Teal Accent (#4ad1c7)
          500: '#3e7aa7', // Ocean Blue Midtone (#3e7aa7)
          600: '#1f357c', // Deep Royal Navy Primary (#1f357c)
          700: '#192c67',
          800: '#142251',
          900: '#0c1633',
          950: '#070d1f',
        },
        green: {
          50: '#f0f7fb',
          100: '#dcedf6',
          200: '#b5caf3',
          300: '#8dc1e3',
          400: '#4ad1c7', // Vibrant Teal Accent (#4ad1c7)
          500: '#3e7aa7', // Ocean Blue Midtone (#3e7aa7)
          600: '#1f357c', // Deep Royal Navy Primary (#1f357c)
          700: '#192c67',
          800: '#142251',
          900: '#0c1633',
          950: '#070d1f',
        },
        brand: {
          50: '#edfbf9',
          100: '#d5f7f4',
          200: '#aef0e9',
          300: '#65ded5',
          400: '#4ad1c7', // Vibrant Teal Accent (#4ad1c7)
          500: '#3e7aa7', // Ocean Blue (#3e7aa7)
          600: '#1f357c', // Deep Royal Navy (#1f357c)
          700: '#192c67',
          800: '#142251',
          900: '#0c1633',
          950: '#070d1f',
        },
        navy: {
          50: '#eef3fc',
          100: '#d9e4f9',
          200: '#b5caf3',
          500: '#1f357c',
          600: '#192c67',
          700: '#142251',
          800: '#0e183a',
          900: '#0c1633',
        },
        ocean: {
          50: '#f0f7fb',
          100: '#dcedf6',
          300: '#8dc1e3',
          500: '#3e7aa7',
          600: '#316489',
          700: '#264e6b',
        },
        tealAccent: {
          50: '#edfbf9',
          100: '#d5f7f4',
          200: '#aef0e9',
          400: '#65ded5',
          500: '#4ad1c7',
          600: '#2fb9af',
          700: '#23948c',
        },
      },
    },
  },
  plugins: [],
};
