// Chart configuration with brand colors
import { colors } from "@/styles/design-tokens";

export const chartConfig = {
  colors: {
    primary: colors.brandPurple,
    secondary: colors.brandCyan,
    success: colors.brandGreen,
    warning: colors.brandAmber,
    danger: colors.brandRed,
  },
  
  // Common chart props
  defaultProps: {
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
    animationDuration: 300,
    animationEasing: "ease-in-out" as const,
  },

  // Theme for tooltip and legends
  theme: {
    text: colors.textPrimary,
    background: colors.bgCard,
    border: colors.borderDark,
  },

  // Line chart configuration
  line: {
    strokeWidth: 2,
    dot: false,
    activeDot: { r: 6 },
  },

  // Bar chart configuration
  bar: {
    radius: [8, 8, 0, 0],
    animationDuration: 300,
  },
};

// Chart color schemes
export const colorSchemes = {
  default: [colors.brandPurple, colors.brandCyan, colors.brandGreen],
  balanced: [
    colors.brandPurple,
    colors.brandCyan,
    colors.brandGreen,
    colors.brandAmber,
    colors.brandRed,
  ],
  pastel: [
    colors.brandPurpleLight,
    "rgba(6, 182, 212, 0.3)",
    "rgba(16, 185, 129, 0.3)",
  ],
};

export const getChartColors = (scheme: "default" | "balanced" | "pastel" = "default") => {
  return colorSchemes[scheme];
};
