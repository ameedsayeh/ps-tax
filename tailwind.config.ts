import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#F1F5F9",
          card: "#FFFFFF",
        },
        fg: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
        },
        primary: {
          DEFAULT: "#0284C7",
          dark: "#0369A1",
          light: "#E0F2FE",
        },
        success: {
          DEFAULT: "#059669",
          light: "#D1FAE5",
          text: "#065F46",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
          text: "#991B1B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.05)",
        "input-focus": "0 0 0 3px rgba(2,132,199,0.18)",
        "btn-primary": "0 1px 3px rgba(2,132,199,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-up": "fadeUp 380ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 250ms ease both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
