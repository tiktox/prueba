"use client";

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const FloatingActionButtonComponent = dynamic(
  () => import('@/components/custom/floating-action-button'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-accent text-accent-foreground opacity-50 cursor-not-allowed"
          aria-label="Digitaliza tu empresa"
          disabled
        >
          <Zap className="h-6 w-6 sm:mr-2" />
          <span className="hidden sm:inline">Digitaliza tu Empresa</span>
        </Button>
      </div>
    ),
  }
);

export default function FloatingActionButtonWrapper() {
  return <FloatingActionButtonComponent />;
}
