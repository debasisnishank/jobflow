import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import dynamicImport from "next/dynamic";
import { getAppConfigFromDB } from "@/lib/admin/app-config.server";
import { appConfig as staticConfig } from "@/lib/config/app.config";

const ThemeProvider = dynamicImport(
  () => import("@/components/theme-provider").then((mod) => mod.ThemeProvider),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background" />
    ),
  }
);

const AppConfigProvider = dynamicImport(
  () => import("@/contexts/AppConfigContext").then((mod) => mod.AppConfigProvider),
  {
    ssr: false,
  }
);

const AuthProvider = dynamicImport(
  () => import("@/providers/AuthProvider").then((mod) => mod.AuthProvider),
  {
    ssr: true, // AuthProvider (SessionProvider) supports SSR
  }
);

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

async function buildMetadata(): Promise<Metadata> {
  let config = staticConfig;
  try {
    config = await getAppConfigFromDB();
  } catch (error) {
    config = staticConfig;
  }

  const baseMetadata: Metadata = {
    title: {
      template: `%s | ${config.brandName}`,
      default: config.brandName,
    },
    description: config.description,
  };

  if (config.faviconPath) {
    return {
      ...baseMetadata,
      icons: {
        icon: config.faviconPath,
        apple: config.faviconPath,
      },
    };
  }

  return baseMetadata;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata();
}

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<Props>) {
  let config = staticConfig;
  try {
    config = await getAppConfigFromDB();
  } catch (error) {
    config = staticConfig;
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="dns-prefetch" href="https://f.vimeocdn.com" />
        {config.faviconPath && (
          <>
            <link rel="icon" href={config.faviconPath} />
            <link rel="apple-touch-icon" href={config.faviconPath} />
          </>
        )}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --gradient-start: ${config.gradientStart || config.primaryColor};
              --gradient-end: ${config.gradientEnd || config.secondaryColor};
            }
          `
        }} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          plusJakartaSans.variable
        )}
      >
        <AppConfigProvider>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </AppConfigProvider>
      </body>
    </html>
  );
}
