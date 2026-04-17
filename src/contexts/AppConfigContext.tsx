"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { AppConfig } from "@/lib/config/app.config";
import { appConfig as staticConfig } from "@/lib/config/app.config";

interface AppConfigContextType {
  config: AppConfig;
  isLoading: boolean;
}

const AppConfigContext = createContext<AppConfigContextType>({
  config: staticConfig,
  isLoading: false,
});

const CACHE_KEY = "app-config-cache";
const CACHE_TTL = 5 * 60 * 1000;

function getCachedConfig(): AppConfig | null {
  if (typeof window === "undefined") return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp < CACHE_TTL) {
      return data as AppConfig;
    }
    
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

function setCachedConfig(config: AppConfig): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: config,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore localStorage errors
  }
}

export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(() => getCachedConfig() || staticConfig);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchConfig = async (skipCache = false) => {
      if (isFetchingRef.current) return;
      
      const cached = skipCache ? null : getCachedConfig();
      if (cached && !skipCache) {
        setConfig(cached);
        setIsLoading(false);
        return;
      }

      isFetchingRef.current = true;
      
      try {
        const response = await fetch("/api/config", {
          cache: "force-cache",
          next: { revalidate: 60 },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.brandName) {
            const appConfig = data as AppConfig;
            setConfig(appConfig);
            setCachedConfig(appConfig);
          }
        }
      } catch (error) {
        console.error("Failed to fetch app config:", error);
        const cached = getCachedConfig();
        if (cached) {
          setConfig(cached);
        }
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchConfig();

    const handleConfigUpdate = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(CACHE_KEY);
      }
      fetchConfig(true);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CACHE_KEY && e.newValue === null) {
        fetchConfig(true);
      }
    };

    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      broadcastChannel = new BroadcastChannel("app-config-updates");
      broadcastChannel.onmessage = () => {
        handleConfigUpdate();
      };
    }

    window.addEventListener("app-config-updated", handleConfigUpdate);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("app-config-updated", handleConfigUpdate);
      window.removeEventListener("storage", handleStorageChange);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, []);

  useEffect(() => {
    if (config.primaryColor && config.secondaryColor) {
      document.documentElement.style.setProperty("--gradient-start", config.gradientStart || config.primaryColor);
      document.documentElement.style.setProperty("--gradient-end", config.gradientEnd || config.secondaryColor);
    }
  }, [config]);

  return (
    <AppConfigContext.Provider value={{ config, isLoading }}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfigContext() {
  return useContext(AppConfigContext);
}
