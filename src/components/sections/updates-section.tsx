"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CalendarDays, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UpdateItem {
  id: string;
  tag: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  link: string;
  aiHint: string;
}

const updatesData: UpdateItem[] = [
  {
    id: "1",
    tag: "Nuevo Proyecto",
    title: "Prime Legacy Ring",
    date: "Próximamente",
    excerpt: "Imagina realizar tus pagos, depósitos y retiros de forma rápida y segura.",
    image: "https://ik.imagekit.io/ajkl5a98u/1.jpg?updatedAt=1746829006260",
    link: "#",
    aiHint: "futuristic payment ring"
  },
  {
    id: "2",
    tag: "Eventos",
    title: 'Únete a nuestra membresía "VIX"',
    date: "Próximamente",
    excerpt: 'Te brindamos desde eventos empresariales hasta actualizaciones festivas "VIX".',
    image: "https://ik.imagekit.io/ajkl5a98u/VIX%20(2).png?updatedAt=1746981733097",
    link: "#", // Was vix.html
    aiHint: "exclusive membership event"
  },
  {
    id: "3",
    tag: "Proyecto Futuro",
    title: "Deyconic Office",
    date: "Próximamente",
    excerpt: "Oficina principal, Santiago de los Caballeros para brindar un servicio de calidad.",
    image: "https://picsum.photos/seed/deyconicoffice/600/400",
    link: "#",
    aiHint: "modern office building"
  },
];

export default function UpdatesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % updatesData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + updatesData.length) % updatesData.length);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); // Auto-scroll every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex]);


  const currentUpdate = updatesData[currentIndex];

  return (
    <section id="actualizaciones" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground tracking-tight mb-4">
            Nuestras <span className="text-primary">Actualizaciones</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mantente al día con las últimas novedades y avances de Deyconic.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUpdate.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Card className="overflow-hidden shadow-xl rounded-xl flex flex-col md:flex-row">
                <div className="md:w-1/2 relative h-64 md:h-auto min-h-[300px]">
                  <Image
                    src={currentUpdate.image}
                    alt={currentUpdate.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={currentUpdate.aiHint}
                  />
                   <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                     {currentUpdate.tag}
                   </div>
                </div>
                <div className="md:w-1/2 flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground">{currentUpdate.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <CalendarDays className="h-4 w-4 mr-2" /> {currentUpdate.date}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{currentUpdate.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="group">
                      <a href={currentUpdate.link} target="_blank" rel="noopener noreferrer">
                        Leer más
                        <ExternalLink className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                      </a>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 rounded-full shadow-md bg-background hover:bg-muted z-10"
            aria-label="Anterior Actualización"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 rounded-full shadow-md bg-background hover:bg-muted z-10"
            aria-label="Siguiente Actualización"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
            {updatesData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-primary w-6' : 'bg-muted hover:bg-primary/50'}`}
                aria-label={`Ir a actualización ${index + 1}`}
              />
            ))}
          </div>

      </div>
    </section>
  );
}
