"use client";

import { useState, useEffect } from "react";
import { appConfig as staticConfig } from "@/lib/config/app.config";

interface AppColors {
  primaryColor: string;
  secondaryColor: string;
  gradientStart: string;
  gradientEnd: string;
}

export function useAppColors(useDynamic: boolean = false): AppColors {
  const [dynamicColors, setDynamicColors] = useState<AppColors | null>(null);

  useEffect(() => {
    if (useDynamic) {
      const fetchColors = () => {
        fetch("/api/admin/config")
          .then((res) => res.json())
          .then((data) => {
            if (data.primaryColor && data.secondaryColor) {
              setDynamicColors({
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor,
                gradientStart: data.gradientStart || data.primaryColor,
                gradientEnd: data.gradientEnd || data.secondaryColor,
              });
            }
          })
          .catch(() => {
            setDynamicColors(null);
          });
      };

      fetchColors();

      const handleConfigUpdate = () => {
        fetchColors();
      };

      window.addEventListener("app-config-updated", handleConfigUpdate);
      return () => {
        window.removeEventListener("app-config-updated", handleConfigUpdate);
      };
    }
  }, [useDynamic]);

  if (useDynamic && dynamicColors) {
    return dynamicColors;
  }

  return {
    primaryColor: staticConfig.primaryColor,
    secondaryColor: staticConfig.secondaryColor,
    gradientStart: staticConfig.gradientStart,
    gradientEnd: staticConfig.gradientEnd,
  };
}
