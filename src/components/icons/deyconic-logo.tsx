// src/components/icons/deyconic-logo.tsx
"use client";

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface DeyconicLogoProps {
  className?: string;
  lightLogoUrl: string;
  darkLogoUrl: string;
  width?: number;
  height?: number;
}

export function DeyconicLogo({ className, lightLogoUrl, darkLogoUrl, width = 32, height = 32 }: DeyconicLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder or null to avoid hydration mismatch
    return <div style={{ width: `${width}px`, height: `${height}px` }} className={className} />;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const logoUrl = currentTheme === 'dark' ? darkLogoUrl : lightLogoUrl;

  return (
    <Image
      src={logoUrl}
      alt="Deyconic Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
