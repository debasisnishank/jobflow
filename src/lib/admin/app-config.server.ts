import "server-only";
import { AppConfig } from "@/lib/config/app.config";
import { getAppConfig } from "./config.service";

export async function getAppConfigFromDB(): Promise<AppConfig> {
  return getAppConfig();
}
