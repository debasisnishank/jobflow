"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "./use-toast";
import { useAppConfigContext } from "@/contexts/AppConfigContext";

interface CompanyLogoProps {
  src: string | null | undefined;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
}

export function CompanyLogo({
  src,
  alt = "Company logo",
  width = 32,
  height = 32,
  className = "",
  fallbackSrc,
}: CompanyLogoProps) {
  const { config } = useAppConfigContext();
  const defaultFallback = fallbackSrc || config.logoPath;
  const [imageSrc, setImageSrc] = useState<string>(src || defaultFallback);
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasShownToast, setHasShownToast] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const currentFallback = fallbackSrc || config.logoPath;
    if (src && src !== currentFallback) {
      setImageSrc(src);
      setHasError(false);
      setHasShownToast(false);
    } else {
      setImageSrc(currentFallback);
    }
  }, [src, fallbackSrc, config.logoPath]);

  const handleImageError = () => {
    const currentFallback = fallbackSrc || config.logoPath;
    if (!hasError && src && src !== currentFallback && !hasShownToast) {
      setHasError(true);
      setImageSrc(currentFallback);
      setHasShownToast(true);
      toast({
        variant: "destructive",
        title: "Image Load Failed",
        description: "The company logo could not be loaded. Using default logo instead.",
      });
    } else if (!hasError) {
      setHasError(true);
      setImageSrc(currentFallback);
    }
  };

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      src={imageSrc}
      width={width}
      onError={handleImageError}
      unoptimized={imageSrc.startsWith("http")}
    />
  );
}

