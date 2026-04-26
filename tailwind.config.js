/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d9f1ff",
          200: "#b4e2ff",
          300: "#84ccff",
          400: "#4eb0ff",
          500: "#1d8cff",
          600: "#0864cc",
          700: "#0b4f9d",
          800: "#104480",
          900: "#153b6a"
        },
        accent: {
          500: "#ff6b2d",
          600: "#e4551a"
        }
      },
      boxShadow: {
        card: "0 12px 32px rgba(9, 19, 46, 0.12)"
      }
    }
  },
  plugins: []
};
