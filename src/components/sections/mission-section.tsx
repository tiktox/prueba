
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import VisionModal from "@/components/modals/vision-modal";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function MissionSection() {
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);

  return (
    <section id="nuestra-mision" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative h-80 md:h-96 lg:h-[450px] rounded-xl overflow-hidden shadow-2xl order-1 lg:order-none"
          >
            <Image
              src="https://ik.imagekit.io/ajkl5a98u/cfb9cecc3d0168675a245b6dfdee8b13.jpg?updatedAt=1746988798872"
              alt="Misión de Deyconic"
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition-transform duration-500"
              data-ai-hint="team planning"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-foreground tracking-tight">
              Nuestra <span className="text-primary">Misión</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              En Deyconic, nuestra misión es impulsar el crecimiento y la innovación empresarial mediante soluciones digitales y estratégicas de alta calidad. Nos dedicamos a transformar ideas en proyectos exitosos, acompañando a emprendedores y empresas establecidas en su viaje hacia la excelencia.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trabajamos con pasión y compromiso para crear oportunidades de desarrollo sostenible, potenciando el talento dominicano y contribuyendo al fortalecimiento del ecosistema empresarial del país. Cada proyecto que emprendemos está orientado a superar expectativas, manteniendo siempre nuestra filosofía de que "no hay límites para mejorar".
            </p>
            <Button onClick={() => setIsVisionModalOpen(true)} variant="outline" className="group">
              <Eye className="mr-2 h-5 w-5 text-primary group-hover:text-accent transition-colors" />
              Ver Nuestra Visión
            </Button>
          </motion.div>
        </div>
      </div>
      <VisionModal isOpen={isVisionModalOpen} onClose={() => setIsVisionModalOpen(false)} />
    </section>
  );
}

