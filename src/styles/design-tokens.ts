// Design Tokens - Color System
export const colors = {
  // Brand Colors
  brandPurple: "#7C3AED",
  brandPurpleDark: "#5B21B6",
  brandPurpleLight: "#EDE9FE",
  brandCyan: "#06B6D4",
  brandGreen: "#10B981",
  brandAmber: "#F59E0B",
  brandRed: "#EF4444",

  // Dark Theme
  bgDark: "#0F0F1A",
  bgSurface: "#16162A",
  bgCard: "#1E1E35",
  borderDark: "rgba(255,255,255,0.08)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.35)",

  // Light Theme
  bgLight: "#F8F7FF",
  bgLightSurface: "#FFFFFF",
  borderLight: "rgba(0,0,0,0.08)",
  textLightPrimary: "#0F0F1A",
  textLightSecondary: "rgba(0,0,0,0.6)",
  textLightMuted: "rgba(0,0,0,0.35)",
};

// Typography
export const typography = {
  fontFamily: {
    sans: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: { size: "12px", lineHeight: "16px" },
    sm: { size: "13px", lineHeight: "18px" },
    base: { size: "14px", lineHeight: "20px" },
    lg: { size: "16px", lineHeight: "24px" },
    xl: { size: "20px", lineHeight: "28px" },
    "2xl": { size: "24px", lineHeight: "32px" },
    "3xl": { size: "32px", lineHeight: "40px" },
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Spacing System
export const spacing = {
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
};

// Shadows
export const shadows = {
  glowPurple: "0 0 20px rgba(124,58,237,0.3)",
  glowCyan: "0 0 20px rgba(6,182,212,0.3)",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
};

// Borders
export const borders = {
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  width: {
    thin: "1px",
    base: "2px",
    thick: "4px",
  },
};

// Transitions
export const transitions = {
  default: "all 0.2s ease",
  fast: "all 0.1s ease",
  slow: "all 0.3s ease",
};

// Z-index
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Breakpoints
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};
