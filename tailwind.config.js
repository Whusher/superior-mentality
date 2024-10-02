/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "minimal": "#BDD9F2",
        "plus-min": "#8BADD9",
        "opac": "#6581A6",
        "darker-light": "#3D5473",
        "dark": "#1D2C40"
      }
    },
  },
  plugins: [],
}