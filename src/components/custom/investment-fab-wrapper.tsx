
"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import InvestmentModal from "@/components/modals/investment-modal";

const InversionButtonClientOnly = dynamic(
  () => import('@/components/custom/inversion-button'), // Import the new button
  { 
    ssr: false,
    loading: () => ( // Optional: A basic placeholder to avoid layout shift
      <div className="fixed bottom-[calc(theme(spacing.6)_+_4.5rem)] right-6 z-50 sm:bottom-[calc(theme(spacing.6)_+_4rem)] opacity-0">
        {/* Placeholder structure similar to the button to reserve space */}
        <div className="relative rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary">
        </div>
      </div>
    )
  }
);

export default function InvestmentFabWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <InversionButtonClientOnly onOpenModal={handleOpenModal} />
      <InvestmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
