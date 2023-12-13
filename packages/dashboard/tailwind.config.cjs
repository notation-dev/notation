/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "2000px",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        brand: {
          DEFAULT: "#FE5537",
          500: "#FE5537",
          700: "#E8543A",
        },
      },
      fontSize: {
        base: "0.825rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
