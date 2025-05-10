"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import EvaluationModal from "@/components/modals/evaluation-modal";
import { useState } from "react";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20 dark:from-primary/5 dark:via-background dark:to-secondary/10">
      {/* Placeholder for WebGL/Three.js dynamic background */}
      <div className="absolute inset-0 opacity-50">
        {/* Example: simple animated gradient or geometric pattern */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-primary/10"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ backgroundSize: "400% 400%" }}
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Deyconic te brinda <span className="text-primary">Innovación</span> y <span className="text-accent">Desarrollo</span>
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Lleva tu negocio al éxito digital con nuestras soluciones estratégicas y tecnológicas de vanguardia.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow group" onClick={() => setIsModalOpen(true)}>
            Evalúa tu Empresa
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
      <EvaluationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
