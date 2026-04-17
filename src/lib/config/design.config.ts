import { appConfig } from "./app.config";

export interface DesignConfig {
  colors: {
    primary: string;
    secondary: string;
    gradientStart: string;
    gradientEnd: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
  };
  gradients: {
    primary: string;
    text: string;
    background: string;
    card: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
      "5xl": string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const designConfig: DesignConfig = {
  colors: {
    primary: appConfig.primaryColor,
    secondary: appConfig.secondaryColor,
    gradientStart: appConfig.gradientStart,
    gradientEnd: appConfig.gradientEnd,
    background: "#FFFFFF",
    foreground: "#1F2937",
    muted: "#64748B",
    accent: "#2563EB",
  },
  gradients: {
    primary: `linear-gradient(135deg, ${appConfig.gradientStart} 0%, ${appConfig.gradientEnd} 100%)`,
    text: `linear-gradient(135deg, ${appConfig.primaryColor} 0%, ${appConfig.secondaryColor} 100%)`,
    background: `linear-gradient(180deg, ${appConfig.gradientStart}15 0%, rgba(255, 255, 255, 0) 100%)`,
    card: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)`,
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
    "3xl": "6rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
};


