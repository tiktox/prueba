"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsSection() {
  return (
    <section id="noticias" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground tracking-tight mb-4">
            Noticias y <span className="text-primary">Artículos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mantente informado con las últimas tendencias en innovación digital y gestión empresarial.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-card rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
        >
          <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full group">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster="https://picsum.photos/seed/newsvideo/800/600"
              data-ai-hint="business technology"
            >
              <source src="https://videos.pexels.com/video-files/18069166/18069166-hd_1280_720_24fps.mp4" type="video/mp4" />
              Tu navegador no soporta videos HTML5.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              Deyconic News
            </div>
          </div>
          <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-block text-primary font-semibold mb-2 text-sm uppercase tracking-wider">
              Transformación Digital
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-3">
              Tendencias digitales que marcarán el 2025
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" /> 15 Marzo 2025
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" /> 5 min lectura
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              En 2025, veremos una adopción masiva de IA generativa (como ChatGPT, Gemini, Claude, etc.) integrada directamente en tiendas en línea, herramientas de productividad y más. Exploramos cómo esto cambiará el panorama empresarial.
            </p>
            <Button asChild variant="default" className="self-start group">
              <a href="#" target="_blank" rel="noopener noreferrer">
                Leer artículo completo
                <ExternalLink className="ml-2 h-4 w-4 group-hover:rotate-[360deg] transition-transform duration-500" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
