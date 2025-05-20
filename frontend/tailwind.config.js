/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",      // primary blue
          foreground: "#ffffff",
          soft: "#1e40af",
        },
        surface: {
          DEFAULT: "#f9fafb",
          dark: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};