/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E3350D",
        secondary: "#3B4CCA",
      },
    },
    fontFamily: {
      pokemon: ['"Fredoka"', "sans-serif"],
      retro: ['"Press Start 2P"', "cursive"],
    },
  },
  plugins: [],
};
