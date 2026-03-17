import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f6f3ef",
        cloud: "#f8fafc",
        coral: "#ff6b6b",
        ocean: "#0ea5e9",
        moss: "#16a34a",
        graphite: "#334155",
        amber: "#f59e0b"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 23, 42, 0.12)",
        lift: "0 14px 30px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
