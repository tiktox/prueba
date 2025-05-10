"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PortfolioDetailModal, { type PortfolioItem } from "@/components/modals/portfolio-detail-modal";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, ArrowRight } from "lucide-react";

const portfolioData: PortfolioItem[] = [
  {
    id: "1",
    title: "Digitalización Empresarial - Clínica Dental",
    category: "Digitalización",
    client: "Clínica Dental XYZ",
    date: "2024",
    description: "Desarrollo de una plataforma web completa para una clínica dental, incluyendo sistema de citas online, gestión de pacientes y marketing digital.",
    features: ["Sistema de reservas online", "Portal de pacientes", "Optimización SEO local", "Diseño web responsive"],
    mainImage: "https://ik.imagekit.io/ajkl5a98u/clinica%20dental%201.jpg?updatedAt=1746197438549",
    thumbnails: [
        "https://ik.imagekit.io/ajkl5a98u/clinica%20dental%201.jpg?updatedAt=1746197438549",
        "https://picsum.photos/seed/dental2/400/300",
        "https://picsum.photos/seed/dental3/400/300",
    ],
    projectLink: "#",
    aiHint: "dental clinic website"
  },
  {
    id: "2",
    title: "Gestión de Proyectos - Mr. Grilled",
    category: "Gestión",
    client: "Mr. Grilled Hotelería",
    date: "2023",
    description: "Automatización de procesos internos y gestión de proyectos para una cadena hotelera, mejorando la eficiencia operativa.",
    features: ["Software de gestión de tareas", "Integración de sistemas", "Dashboard de KPIs", "Optimización de flujos de trabajo"],
    mainImage: "https://ik.imagekit.io/ajkl5a98u/mr%20grilled%201.jpg?updatedAt=1746197443058",
    thumbnails: [
        "https://ik.imagekit.io/ajkl5a98u/mr%20grilled%201.jpg?updatedAt=1746197443058",
        "https://picsum.photos/seed/hotel2/400/300",
        "https://picsum.photos/seed/hotel3/400/300",
    ],
    aiHint: "hotel management software"
  },
  {
    id: "3",
    title: "Plataforma de Innovación - Deyconic Store",
    category: "Innovación",
    client: "Startup Tecnológica Local",
    date: "2024",
    description: "Desarrollo de un marketplace innovador para una startup, conectando proveedores y consumidores de productos tecnológicos.",
    features: ["Plataforma e-commerce", "Sistema de pagos seguro", "Perfiles de usuario avanzados", "Panel de administración"],
    mainImage: "https://ik.imagekit.io/ajkl5a98u/deyconic%20store.jpg?updatedAt=1746197440975",
    thumbnails: [
        "https://ik.imagekit.io/ajkl5a98u/deyconic%20store.jpg?updatedAt=1746197440975",
        "https://picsum.photos/seed/store2/400/300",
        "https://picsum.photos/seed/store3/400/300",
    ],
    aiHint: "e-commerce marketplace"
  },
];

const filters = ["Todos", "Gestión", "Digitalización", "Innovación"];

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = activeFilter === "Todos"
    ? portfolioData
    : portfolioData.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <section id="portafolio" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground tracking-tight mb-4">
            Nuestro <span className="text-primary">Portafolio</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce algunos de nuestros proyectos más destacados.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-12"
        >
          {filters.map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className="rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base transition-all duration-300 flex items-center"
            >
              {activeFilter === filter && <Check className="mr-2 h-4 w-4" />}
              {filter}
            </Button>
          ))}
        </motion.div>

        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleItemClick(item)}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden group h-full flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl hover:border-primary">
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={item.mainImage}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="transform group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint={item.aiHint || "project image"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Eye className="h-12 w-12 text-white/90" />
                    </div>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col bg-background">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{item.category}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-auto self-start group/button hover:bg-primary hover:text-primary-foreground border-primary text-primary">
                      Ver detalles <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <PortfolioDetailModal item={selectedItem} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}
