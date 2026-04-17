export interface FaviconConfig {
  letter: string;
  fontSize: number;
  borderRadius: string;
  textColor: string;
  gradientStart: string;
  gradientEnd: string;
}

export async function getFaviconConfig(): Promise<FaviconConfig | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/config`, {
      cache: "no-store",
    });
    
    if (response.ok) {
      const config = await response.json();
      if (config.faviconPath && config.faviconPath.trim() !== "") {
        return null;
      }
      
      return {
        letter: config.faviconLetter || "C",
        fontSize: parseInt(config.faviconFontSize || "24"),
        borderRadius: config.faviconBorderRadius || "6",
        textColor: config.faviconTextColor || "#FFFFFF",
        gradientStart: config.gradientStart || config.primaryColor || "#3B82F6",
        gradientEnd: config.gradientEnd || config.secondaryColor || "#1D4ED8",
      };
    }
  } catch (error) {
    console.error("Failed to fetch favicon config:", error);
  }

  const customFaviconPath = process.env.NEXT_PUBLIC_FAVICON_PATH;
  if (customFaviconPath && customFaviconPath.trim() !== "") {
    return null;
  }

  return {
    letter: process.env.NEXT_PUBLIC_FAVICON_LETTER || "C",
    fontSize: parseInt(process.env.NEXT_PUBLIC_FAVICON_FONT_SIZE || "24"),
    borderRadius: process.env.NEXT_PUBLIC_FAVICON_BORDER_RADIUS || "6",
    textColor: process.env.NEXT_PUBLIC_FAVICON_TEXT_COLOR || "#FFFFFF",
    gradientStart: process.env.NEXT_PUBLIC_GRADIENT_START || "#3B82F6",
    gradientEnd: process.env.NEXT_PUBLIC_GRADIENT_END || "#1D4ED8",
  };
}

export async function getAppleIconConfig(): Promise<FaviconConfig | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/config`, {
      cache: "no-store",
    });
    
    if (response.ok) {
      const config = await response.json();
      if (config.faviconPath && config.faviconPath.trim() !== "") {
        return null;
      }
      
      return {
        letter: config.faviconLetter || "C",
        fontSize: 120,
        borderRadius: "20",
        textColor: config.faviconTextColor || "#FFFFFF",
        gradientStart: config.gradientStart || config.primaryColor || "#3B82F6",
        gradientEnd: config.gradientEnd || config.secondaryColor || "#1D4ED8",
      };
    }
  } catch (error) {
    console.error("Failed to fetch favicon config:", error);
  }

  const customFaviconPath = process.env.NEXT_PUBLIC_FAVICON_PATH;
  if (customFaviconPath && customFaviconPath.trim() !== "") {
    return null;
  }

  return {
    letter: process.env.NEXT_PUBLIC_FAVICON_LETTER || "C",
    fontSize: 120,
    borderRadius: "20",
    textColor: process.env.NEXT_PUBLIC_FAVICON_TEXT_COLOR || "#FFFFFF",
    gradientStart: process.env.NEXT_PUBLIC_GRADIENT_START || "#3B82F6",
    gradientEnd: process.env.NEXT_PUBLIC_GRADIENT_END || "#1D4ED8",
  };
}
