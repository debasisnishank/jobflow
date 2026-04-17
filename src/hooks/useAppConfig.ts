import { appConfig } from "@/lib/config/app.config";
import { designConfig } from "@/lib/config/design.config";

export function useAppConfig() {
  return {
    app: appConfig,
    design: designConfig,
  };
}


