
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import EvaluationModal from "@/components/modals/evaluation-modal";
import { useState } from "react";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://picsum.photos/seed/hero-background/1920/1080" 
          data-ai-hint="abstract technology"
        >
          <source src="https://videos.pexels.com/video-files/3209211/3209211-sd_640_360_25fps.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6" // Changed text color to white for better contrast
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Deyconic te brinda <span className="text-primary">Innovación</span> y <span className="text-accent">Desarrollo</span>
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-10" // Changed text color for better contrast
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
          <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow group bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsModalOpen(true)}>
            Evalúa tu Empresa
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
      <EvaluationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

