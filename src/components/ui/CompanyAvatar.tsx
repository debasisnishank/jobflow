"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useToast } from "./use-toast";

interface CompanyAvatarProps {
  src: string | null | undefined;
  alt?: string;
  fallbackText?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

export function CompanyAvatar({
  src,
  alt = "Company logo",
  fallbackText,
  className = "",
  size = "md",
}: CompanyAvatarProps) {
  const [imageError, setImageError] = useState<boolean>(false);
  const { toast } = useToast();

  const handleImageError = () => {
    if (!imageError && src) {
      setImageError(true);
      toast({
        variant: "destructive",
        title: "Image Load Failed",
        description: "The company logo could not be loaded. Using fallback instead.",
      });
    }
  };

  const displayText = fallbackText || alt?.charAt(0).toUpperCase() || "C";

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {src && !imageError ? (
        <AvatarImage
          src={src}
          alt={alt}
          onError={handleImageError}
        />
      ) : null}
      <AvatarFallback>{displayText}</AvatarFallback>
    </Avatar>
  );
}

















