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
          deep: "#020203",
          base: "#050506",
          elevated: "#0a0a0c",
        },
        fg: {
          DEFAULT: "#EDEDEF",
          muted: "#8A8F98",
        },
        accent: {
          DEFAULT: "#5E6AD2",
          bright: "#6872D9",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "var(--font-arabic)",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-sans)",
          "var(--font-arabic)",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "monospace",
        ],
      },
      letterSpacing: {
        displayed: "-0.03em",
      },
      boxShadow: {
        "card": "0 0 0 1px rgba(255,255,255,0.06), 0 2px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)",
        "card-hover": "0 0 0 1px rgba(255,255,255,0.10), 0 8px 40px rgba(0,0,0,0.5), 0 0 80px rgba(94,106,210,0.10)",
        "accent": "0 0 0 1px rgba(94,106,210,0.5), 0 4px 12px rgba(94,106,210,0.30), inset 0 1px 0 0 rgba(255,255,255,0.2)",
        "accent-hover": "0 0 0 1px rgba(94,106,210,0.7), 0 8px 24px rgba(94,106,210,0.45), inset 0 1px 0 0 rgba(255,255,255,0.25)",
        "inset-highlight": "inset 0 1px 0 0 rgba(255,255,255,0.10)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "float-slow": "float 10s ease-in-out infinite",
        "float-slower": "float 14s ease-in-out infinite",
        "float-pulse": "floatPulse 8s ease-in-out infinite",
        "shimmer": "shimmer 6s ease-in-out infinite",
        "fade-up": "fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, -20px, 0) rotate(1deg)" },
        },
        floatPulse: {
          "0%, 100%": { opacity: "0.6", transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { opacity: "0.9", transform: "translate3d(0, -10px, 0) scale(1.03)" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translate3d(0, 24px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
