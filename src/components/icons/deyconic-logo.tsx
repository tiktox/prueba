// src/components/icons/deyconic-logo.tsx
import type { SVGProps } from 'react';

export function DeyconicLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
      <path
        d="M128 16C94.6 16 64 41.3 64 72c0 12.6 4.1 24.2 11.1 33.8C71.5 111.2 64 120.9 64 132c0 13.2 11.9 24 26.7 24h74.6c14.8 0 26.7-10.8 26.7-24 0-11.1-7.5-20.8-11.1-26.2 7-9.6 11.1-21.2 11.1-33.8C192 41.3 161.4 16 128 16zm0 24c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-32 92v64l48-32-16-32H96zm64 0l-16 32 48 32v-64H160z"
        transform="translate(0, 20)" // Adjusted to better fit the rocket part
      />
      <path
        d="M96 156 L96 240 L128 216 L160 240 L160 156 Z" // Simplified lightning bolt shape
        fillRule="evenodd"
      />
      <circle cx="128" cy="72" r="24" fill="var(--background)" />
    </svg>
  );
}
