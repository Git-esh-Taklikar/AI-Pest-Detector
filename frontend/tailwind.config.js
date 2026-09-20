/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#090d16",
          800: "#0f172a",
          700: "#1e293b",
          600: "#334155"
        },
        pest: {
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
          neon: "#39ff14",
          cyan: "#06b6d4"
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
