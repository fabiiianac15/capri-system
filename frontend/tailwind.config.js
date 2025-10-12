/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta del Sistema Granme (Agropecuaria)
        primary: {
          DEFAULT: '#1a2e02',  // Verde muy oscuro
          hover: '#2a4a04',     // Verde oscuro hover
          light: '#6b7c45',     // Verde oliva medio
          lighter: '#5a6a3a',   // Verde oliva oscuro
        },
        background: {
          DEFAULT: '#e8f0d8',   // Verde muy claro (crema)
          card: '#ffffff',       // Blanco para cards
          secondary: '#d3dbb8',  // Verde suave
        },
        // Mantener colores farm para retrocompatibilidad
        farm: {
          50: '#e8f0d8',
          100: '#d3dbb8',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#6b7c45',
          500: '#5a6a3a',
          600: '#2a4a04',
          700: '#1a2e02',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#E8E8E8',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'farm': '0 4px 20px rgba(26, 46, 2, 0.15)',
        'farm-lg': '0 10px 40px rgba(26, 46, 2, 0.2)',
      },
      borderRadius: {
        'xl': '0.75rem',  // 12px para cards
      },
    },
  },
  plugins: [],
};