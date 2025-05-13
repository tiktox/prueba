"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Keep for other buttons if any, or remove if not used elsewhere in this file
import Image from "next/image";
import { CalendarDays, Tag, User, X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Import cn for class utility

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  date: string;
  description: string;
  features: string[];
  mainImage: string;
  thumbnails: string[];
  projectLink?: string;
  aiHint?: string;
}

interface PortfolioDetailModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PortfolioDetailModal({ item, isOpen, onClose }: PortfolioDetailModalProps) {
  const [currentImage, setCurrentImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<number>(0); // 0: none, 1: next, -1: prev

  useEffect(() => {
    if (item) {
      setAnimationDirection(0);
      setCurrentImage(item.mainImage);
      setCurrentImageIndex(0);
    }
  }, [item]);

  if (!item) return null;

  const allImages = [item.mainImage, ...item.thumbnails.filter(thumb => thumb !== item.mainImage && thumb)];

  const changeImageWithDirection = (newIndex: number, direction: number) => {
    setAnimationDirection(direction);
    setCurrentImageIndex(newIndex);
    setCurrentImage(allImages[newIndex]);
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % allImages.length;
    changeImageWithDirection(newIndex, 1);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    changeImageWithDirection(newIndex, -1);
  };

  const handleThumbnailClick = (imageSrc: string, index: number) => {
    let direction = 0;
    if (index > currentImageIndex) {
      direction = 1;
    } else if (index < currentImageIndex) {
      direction = -1;
    }
    changeImageWithDirection(index, direction);
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction === 0 ? 0 : direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction === 0 ? 0 : direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 shadow-2xl rounded-lg flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        {/* Removed asChild and styled DialogClose directly */}
        <DialogClose
          onClick={onClose}
          className={cn(
            // Base button-like styles from shadcn/ui Button
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            // Approximating ghost variant styles
            "hover:bg-accent hover:text-accent-foreground",
            // Custom styles from the original Button
            "absolute top-4 right-4 z-20 p-0", // p-0 for icon button
            "bg-background/60 hover:bg-background/90",
            "rounded-full h-8 w-8 sm:h-9 sm:w-9"
          )}
          aria-label="Cerrar"
        >
          <X className="h-4 w-4 sm:h-5 sm:h-5" />
        </DialogClose>

        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full flex-shrink-0 group overflow-hidden"> {/* Reduced image heights */}
          <AnimatePresence initial={false} custom={animationDirection} mode="wait">
            <motion.div
              key={currentImage}
              custom={animationDirection}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage || "https://picsum.photos/1200/800"}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={item.aiHint || "project image"}
                className="rounded-t-lg"
                priority={true}
              />
            </motion.div>
          </AnimatePresence>
           {allImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full shadow-md bg-background/50 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 h-8 w-8 sm:h-10 sm:w-10"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full shadow-md bg-background/50 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 h-8 w-8 sm:h-10 sm:w-10"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="flex p-2 sm:p-3 bg-muted space-x-1.5 sm:space-x-2 overflow-x-auto flex-shrink-0">
            {allImages.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(thumb, idx)}
                className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 relative rounded-md overflow-hidden border-2 ${
                  currentImageIndex === idx
                    ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-muted'
                    : 'border-transparent hover:border-primary/70'
                } focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-1 focus:ring-offset-muted transition-all duration-200 ease-in-out`}
                aria-label={`Ver imagen ${idx + 1}`}
              >
                <Image src={thumb} alt={`Thumbnail ${idx + 1}`} layout="fill" objectFit="cover" className="rounded" data-ai-hint={item.aiHint || "project thumbnail"}/>
              </button>
            ))}
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-grow overflow-y-auto min-h-0">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">{item.title}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-1 sm:gap-y-2 text-xs sm:text-sm text-muted-foreground items-center">
            <div className="flex items-center"><CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-primary" /> {item.date}</div>
            <div className="flex items-center"><Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-primary" /> {item.category}</div>
            <div className="flex items-center"><User className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-primary" /> {item.client}</div>
          </div>

          <DialogDescription className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            {item.description}
          </DialogDescription>

          {item.features && item.features.length > 0 && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 md:mb-2">Características principales</h4>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-foreground/80">
                {item.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
              </ul>
            </div>
          )}

          {item.projectLink && (
            <Button asChild variant="default" className="mt-3 sm:mt-4 group text-sm sm:text-base py-2 px-3 sm:py-2.5 sm:px-4">
              <a href={item.projectLink} target="_blank" rel="noopener noreferrer">
                Ver Proyecto
                <ExternalLink className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
