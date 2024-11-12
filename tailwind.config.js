/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*/.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "minimal": "#BDD9F2",
        "plus-min": "#8BADD9",
        "opac": "#6581A6",
        "darker-light": "#3D5473",
        "dark": "#1D2C40"
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(180deg)' }
        },
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      transitionProperty: {
        'transform-opacity': 'transform, opacity',
      },
    },
  },
  plugins: [],
}