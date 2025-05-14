"use client";

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

const ServiceRequestFabComponent = dynamic(
  () => import('@/components/custom/service-request-fab'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary text-primary-foreground opacity-50 cursor-not-allowed"
          aria-label="Solicitar servicio"
          disabled
        >
          <ShoppingBag className="h-6 w-6 sm:mr-2" />
          <span className="hidden sm:inline">Solicitar Servicio</span>
        </Button>
      </div>
    ),
  }
);

export default function ServiceRequestFabWrapper() {
  return <ServiceRequestFabComponent />;
}
