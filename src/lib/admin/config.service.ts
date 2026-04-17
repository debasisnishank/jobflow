import "server-only";
import prisma from "@/lib/db";
import { AppConfig } from "@/lib/config/app.config";

const defaultConfig: AppConfig = {
  appName: "JobFlow",
  brandName: "JobFlow",
  description: "Job Application Tracking System",
  primaryColor: "#3B82F6",
  secondaryColor: "#1D4ED8",
  logoPath: "/images/logo.svg",
  gradientStart: "#3B82F6",
  gradientEnd: "#1D4ED8",
  supportEmail: "support@jobflow.app",
  faviconPath: null,
  faviconLetter: "J",
  faviconFontSize: "24",
  faviconBorderRadius: "6",
  faviconTextColor: "#FFFFFF",
};

function getEnvVar(key: string, defaultValue: string): string {
  return process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
}

let cachedConfig: AppConfig | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000;

export async function getAppConfig(): Promise<AppConfig> {
  const now = Date.now();
  
  if (cachedConfig && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedConfig;
  }

  try {
    const dbConfig = await prisma.appConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (dbConfig) {
      cachedConfig = {
        appName: dbConfig.appName,
        brandName: dbConfig.brandName,
        description: dbConfig.description,
        primaryColor: dbConfig.primaryColor,
        secondaryColor: dbConfig.secondaryColor,
        logoPath: dbConfig.logoPath,
        gradientStart: dbConfig.gradientStart,
        gradientEnd: dbConfig.gradientEnd,
        supportEmail: dbConfig.supportEmail,
        faviconPath: dbConfig.faviconPath,
        faviconLetter: dbConfig.faviconLetter,
        faviconFontSize: dbConfig.faviconFontSize,
        faviconBorderRadius: dbConfig.faviconBorderRadius,
        faviconTextColor: dbConfig.faviconTextColor,
      };
      cacheTimestamp = now;
      return cachedConfig;
    }
  } catch (error) {
    console.error("Error fetching app config from database:", error);
  }

  const envConfig: AppConfig = {
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

  cachedConfig = envConfig;
  cacheTimestamp = now;
  return envConfig;
}

export async function updateAppConfig(config: Partial<AppConfig>): Promise<AppConfig> {
  const existing = await prisma.appConfig.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  const configData = {
    appName: config.appName ?? existing?.appName ?? defaultConfig.appName,
    brandName: config.brandName ?? existing?.brandName ?? defaultConfig.brandName,
    description: config.description ?? existing?.description ?? defaultConfig.description,
    primaryColor: config.primaryColor ?? existing?.primaryColor ?? defaultConfig.primaryColor,
    secondaryColor: config.secondaryColor ?? existing?.secondaryColor ?? defaultConfig.secondaryColor,
    logoPath: config.logoPath ?? existing?.logoPath ?? defaultConfig.logoPath,
    gradientStart: config.gradientStart ?? existing?.gradientStart ?? defaultConfig.gradientStart,
    gradientEnd: config.gradientEnd ?? existing?.gradientEnd ?? defaultConfig.gradientEnd,
    supportEmail: config.supportEmail ?? existing?.supportEmail ?? defaultConfig.supportEmail,
    faviconPath: config.faviconPath !== undefined ? config.faviconPath : (existing?.faviconPath ?? defaultConfig.faviconPath),
    faviconLetter: config.faviconLetter ?? existing?.faviconLetter ?? defaultConfig.faviconLetter,
    faviconFontSize: config.faviconFontSize ?? existing?.faviconFontSize ?? defaultConfig.faviconFontSize,
    faviconBorderRadius: config.faviconBorderRadius ?? existing?.faviconBorderRadius ?? defaultConfig.faviconBorderRadius,
    faviconTextColor: config.faviconTextColor ?? existing?.faviconTextColor ?? defaultConfig.faviconTextColor,
  };

  if (existing) {
    const updated = await prisma.appConfig.update({
      where: { id: existing.id },
      data: configData,
    });

    cachedConfig = null;
    return {
      appName: updated.appName,
      brandName: updated.brandName,
      description: updated.description,
      primaryColor: updated.primaryColor,
      secondaryColor: updated.secondaryColor,
      logoPath: updated.logoPath,
      gradientStart: updated.gradientStart,
      gradientEnd: updated.gradientEnd,
      supportEmail: updated.supportEmail,
      faviconPath: updated.faviconPath,
      faviconLetter: updated.faviconLetter,
      faviconFontSize: updated.faviconFontSize,
      faviconBorderRadius: updated.faviconBorderRadius,
      faviconTextColor: updated.faviconTextColor,
    };
  } else {
    const created = await prisma.appConfig.create({
      data: configData,
    });

    cachedConfig = null;
    return {
      appName: created.appName,
      brandName: created.brandName,
      description: created.description,
      primaryColor: created.primaryColor,
      secondaryColor: created.secondaryColor,
      logoPath: created.logoPath,
      gradientStart: created.gradientStart,
      gradientEnd: created.gradientEnd,
      supportEmail: created.supportEmail,
      faviconPath: created.faviconPath,
      faviconLetter: created.faviconLetter,
      faviconFontSize: created.faviconFontSize,
      faviconBorderRadius: created.faviconBorderRadius,
      faviconTextColor: created.faviconTextColor,
    };
  }
}

export function clearConfigCache() {
  cachedConfig = null;
  cacheTimestamp = 0;
}
