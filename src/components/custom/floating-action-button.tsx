
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import DigitalizationFormModal from "@/components/modals/digitalization-form-modal";
import { motion } from "framer-motion";

export default function FloatingActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50" // Kept original position for this FAB
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="rounded-full shadow-xl hover:shadow-2xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => setIsModalOpen(true)}
          aria-label="Digitaliza tu empresa"
        >
          <Zap className="h-6 w-6 sm:mr-2" />
          <span className="hidden sm:inline">Digitaliza tu Empresa</span>
        </Button>
      </motion.div>
      <DigitalizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
