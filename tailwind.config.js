module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./test/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crt: {
          bg: "#0a0f0d",
          fg: "#33ff33",
          amber: "#ffb000",
          dim: "#114411",
        },
        win95: {
          bg: "#c0c0c0",
          blue: "#000080",
          light: "#ffffff",
          shadow: "#808080",
          darkShadow: "#0a0a0a",
          inputBg: "#ffffff",
        },
        synth: {
          bg: "#0d0221",
          pink: "#ff007f",
          cyan: "#00f0ff",
          purple: "#7000ff",
          yellow: "#ffd700",
        }
      }
    },
  },
  plugins: [],
}
