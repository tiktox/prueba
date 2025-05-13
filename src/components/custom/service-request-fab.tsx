
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import ServiceRequestModal from "@/components/modals/service-request-modal";
import { motion } from "framer-motion";

export default function ServiceRequestFab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0, x: -100 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.5 }} // Slightly later delay
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="rounded-full shadow-xl hover:shadow-2xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsModalOpen(true)}
          aria-label="Solicitar servicio"
        >
          <ShoppingBag className="h-6 w-6 sm:mr-2" />
          <span className="hidden sm:inline">Solicitar Servicio</span>
        </Button>
      </motion.div>
      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
