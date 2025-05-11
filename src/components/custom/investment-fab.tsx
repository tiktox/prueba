
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import InvestmentModal from "@/components/modals/investment-modal";
import { motion } from "framer-motion";

export default function InvestmentFab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-[calc(theme(spacing.6)_+_4.5rem)] right-6 z-50 sm:bottom-[calc(theme(spacing.6)_+_4rem)]" // Adjusted bottom position for stacking
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }} // Slightly delayed animation
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 12px hsl(var(--primary))" }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          variant="default"
          className="rounded-full shadow-xl hover:shadow-2xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary hover:bg-primary/90"
          onClick={() => setIsModalOpen(true)}
          aria-label="Proyectos de Inversión"
        >
          <Briefcase className="h-6 w-6 sm:mr-2" />
          <span className="hidden sm:inline">Proyectos de Inversión</span>
        </Button>
      </motion.div>
      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
