
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CalendarDays, ExternalLink } from "lucide-react";

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
    excerpt: "Imagina realizar tus pagos, depósitos y retiros de forma rápida y segura, todo desde la comodidad de tu mano con un anillo inteligente.",
    image: "https://ik.imagekit.io/ajkl5a98u/1.jpg?updatedAt=1746829006260",
    link: "#",
    aiHint: "futuristic payment ring"
  },
  {
    id: "2",
    tag: "Eventos",
    title: 'Únete a nuestra membresía "VIX"',
    date: "Próximamente",
    excerpt: 'Te brindamos desde eventos empresariales exclusivos hasta actualizaciones festivas y contenido premium con nuestra membresía "VIX".',
    image: "https://ik.imagekit.io/ajkl5a98u/VIX%20(2).png?updatedAt=1746981733097",
    link: "#", 
    aiHint: "exclusive membership event"
  },
  {
    id: "3",
    tag: "Proyecto Futuro",
    title: "Deyconic Office",
    date: "Próximamente",
    excerpt: "Nuestra futura oficina principal en Santiago de los Caballeros, diseñada para fomentar la innovación y brindar un servicio de calidad superior.",
    image: "https://ik.imagekit.io/ajkl5a98u/deyconic%20office.png?updatedAt=1746982459226",
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
    }, 7000); 
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);


  const currentUpdate = updatesData[currentIndex];

  return (
    <section id="actualizaciones" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground tracking-tight mb-4">
            Nuestras <span className="text-primary">Actualizaciones</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mantente al día con las últimas novedades y avances de Deyconic.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto min-h-[32rem] sm:min-h-[28rem] md:min-h-[26rem] lg:min-h-[24rem] xl:min-h-[22rem]"> 
            <div
              key={currentUpdate.id}
              className="w-full absolute inset-0" 
            >
              <Card className="overflow-hidden shadow-xl rounded-xl flex flex-col md:flex-row h-full"> 
                <div className="md:w-1/2 relative h-64 md:h-auto"> 
                  <Image
                    src={currentUpdate.image}
                    alt={currentUpdate.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={currentUpdate.aiHint}
                    priority={currentIndex === updatesData.findIndex(u => u.id === currentUpdate.id)} 
                  />
                   <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                     {currentUpdate.tag}
                   </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-bold text-foreground">{currentUpdate.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow"> 
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <CalendarDays className="h-4 w-4 mr-2" /> {currentUpdate.date}
                    </div>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-4 text-sm md:text-base"> 
                        {currentUpdate.excerpt}
                    </p>
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
            </div>

          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 rounded-full shadow-md bg-background hover:bg-muted z-10 h-10 w-10 md:h-12 md:w-12"
            aria-label="Anterior Actualización"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 rounded-full shadow-md bg-background hover:bg-muted z-10 h-10 w-10 md:h-12 md:w-12"
            aria-label="Siguiente Actualización"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
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
