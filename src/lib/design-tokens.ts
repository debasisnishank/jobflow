import { designConfig } from "./config/design.config";

export const designTokens = {
  colors: designConfig.colors,
  gradients: designConfig.gradients,
  typography: designConfig.typography,
  spacing: designConfig.spacing,
  shadows: designConfig.shadows,
  borderRadius: designConfig.borderRadius,
};

export type DesignTokens = typeof designTokens;


