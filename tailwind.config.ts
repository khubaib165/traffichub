import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-purple": "#7C3AED",
        "brand-purple-dark": "#5B21B6",
        "brand-purple-light": "#EDE9FE",
        "brand-cyan": "#06B6D4",
        "brand-green": "#10B981",
        "brand-amber": "#F59E0B",
        "brand-red": "#EF4444",
        "bg-dark": "#0F0F1A",
        "bg-surface": "#16162A",
        "bg-card": "#1E1E35",
        "border-dark": "rgba(255,255,255,0.08)",
        "bg-light": "#F8F7FF",
        "bg-light-surface": "#FFFFFF",
        "border-light": "rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "18px" }],
        base: ["14px", { lineHeight: "20px" }],
        lg: ["16px", { lineHeight: "24px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["32px", { lineHeight: "40px" }],
      },
      spacing: {
        "4xs": "2px",
        "3xs": "4px",
        "2xs": "6px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(124,58,237,0.3)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.3)",
      },
      backdropFilter: {
        "glass": "blur(12px)",
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "fade-in": "fadeIn 0.3s ease-in",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
  darkMode: "class",
};

export default config;
