module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "rgba(0,0,0,.4)",
        "wo-gray": "#F3F3F3",
        "wo-key": "#D3D6DA",
        "wo-keyboard": "rgba(211,214,218, 0.3)",
        "wo-empty": "rgba(147,155,159, 0.3)",
        "wo-empty-dark": "#565F7E",
        "wo-miss": "#939B9F",
        "wo-present": "#CEB02C",
        "wo-success": "#66A060",
        "wo-black": "#262B3C",
      },
      spacing: {
        128: "638px",
      },
      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fade 0.3s linear",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
