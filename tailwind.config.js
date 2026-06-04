/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./test/sandbox/**/*.{js,jsx,ts,tsx}"
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        retro: {
          bg: '#f0efe9',
          card: '#ffffff',
          border: '#1a1a1a',
          teal: '#008080',
          navy: '#000080',
          gray: '#e5e5e0',
          darkgray: '#7a7a7a',
        }
      }
    },
  },
  plugins: [],
}
