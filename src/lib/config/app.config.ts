export interface AppConfig {
  appName: string;
  brandName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logoPath: string;
  gradientStart: string;
  gradientEnd: string;
  supportEmail: string;
  // Favicon configuration
  faviconPath: string | null; // Path to custom favicon file (null = use generated)
  faviconLetter: string;
  faviconFontSize: string;
  faviconBorderRadius: string;
  faviconTextColor: string;
}

const defaultConfig: AppConfig = {
  appName: "JobFlow",
  brandName: "JobFlow",
  description: "Job Application Tracking System",
  primaryColor: "#2563EB",
  secondaryColor: "#4F46E5",
  logoPath: "/images/logo.svg",
  gradientStart: "#2563EB",
  gradientEnd: "#4F46E5",
  supportEmail: "support@jobflow.app",
  // Favicon defaults
  faviconPath: null, // null = generate letter-based icon
  faviconLetter: "J",
  faviconFontSize: "24",
  faviconBorderRadius: "6",
  faviconTextColor: "#FFFFFF",
};

function getEnvVar(key: string, defaultValue: string): string {
  return process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
}

export const appConfig: AppConfig = {
  appName: getEnvVar("APP_NAME", defaultConfig.appName),
  brandName: getEnvVar("BRAND_NAME", defaultConfig.brandName),
  description: getEnvVar("APP_DESCRIPTION", defaultConfig.description),
  primaryColor: getEnvVar("PRIMARY_COLOR", defaultConfig.primaryColor),
  secondaryColor: getEnvVar("SECONDARY_COLOR", defaultConfig.secondaryColor),
  logoPath: getEnvVar("LOGO_PATH", defaultConfig.logoPath),
  gradientStart: getEnvVar("GRADIENT_START", defaultConfig.gradientStart),
  gradientEnd: getEnvVar("GRADIENT_END", defaultConfig.gradientEnd),
  supportEmail: getEnvVar("SUPPORT_EMAIL", defaultConfig.supportEmail),
  faviconPath: (() => {
    const path = process.env.NEXT_PUBLIC_FAVICON_PATH;
    return path && path.trim() !== "" ? path : null;
  })(),
  faviconLetter: getEnvVar("FAVICON_LETTER", defaultConfig.faviconLetter),
  faviconFontSize: getEnvVar("FAVICON_FONT_SIZE", defaultConfig.faviconFontSize),
  faviconBorderRadius: getEnvVar("FAVICON_BORDER_RADIUS", defaultConfig.faviconBorderRadius),
  faviconTextColor: getEnvVar("FAVICON_TEXT_COLOR", defaultConfig.faviconTextColor),
};

