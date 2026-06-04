/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./test/sandbox/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          light: '#1e1b18',
          DEFAULT: '#0c0a09',
          dark: '#030202',
        }
      }
    },
  },
  plugins: [],
}
