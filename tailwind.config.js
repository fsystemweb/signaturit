/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#111827",
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280"
        },
        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#ef4444"
      },
      borderRadius: {
        lg: "12px"
      }
    }
  },
  plugins: []
}

