import { ImageResponse } from "next/og";
import { getAppleIconConfig } from "@/lib/utils/favicon.utils";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function Icon() {
  const config = await getAppleIconConfig();
  
  if (!config) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#3B82F6",
          }}
        />
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: config.fontSize,
          background: `linear-gradient(135deg, ${config.gradientStart} 0%, ${config.gradientEnd} 100%)`,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: config.textColor,
          fontWeight: "bold",
          borderRadius: `${config.borderRadius}px`,
        }}
      >
        {config.letter}
      </div>
    ),
    {
      ...size,
    }
  );
}
