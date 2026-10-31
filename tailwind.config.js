/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCFBF7',
          100: '#F8F4EB',
          200: '#F1E9DA',
          300: '#E5D6BD',
          400: '#D5BE9B',
        },
        forest: {
          50: '#F2F7F4',
          100: '#E0EDE6',
          200: '#C2DCCF',
          500: '#3C694F',
          600: '#2F543E',
          700: '#254432',
          800: '#1C3527',
          900: '#15291E',
          950: '#0C1811',
        },
        olive: {
          100: '#F0F3EA',
          500: '#5F7642',
          600: '#4E6235',
          700: '#3D4E2A',
        },
        butter: {
          50: '#FFFDF5',
          100: '#FFF8E1',
          200: '#FEEFB8',
          300: '#FDE58B',
          400: '#FCD858',
          500: '#F5C227',
        },
        gold: {
          400: '#E4B869',
          500: '#D4A045',
          600: '#B88325',
          700: '#8E6215',
        },
        charcoal: {
          100: '#E3E5E4',
          300: '#A1A7A4',
          500: '#646B67',
          700: '#393E3B',
          800: '#252927',
          900: '#171A19',
          950: '#0F1211',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(23, 26, 25, 0.05), 0 2px 6px -1px rgba(23, 26, 25, 0.03)',
        'premium': '0 10px 30px -4px rgba(21, 41, 30, 0.08), 0 4px 12px -2px rgba(21, 41, 30, 0.04)',
        'float': '0 20px 40px -8px rgba(21, 41, 30, 0.12), 0 8px 16px -4px rgba(21, 41, 30, 0.06)',
      }
    },
  },
  plugins: [],
};
