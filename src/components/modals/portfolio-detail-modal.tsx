"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CalendarDays, Tag, User, X, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [currentImage, setCurrentImage] = useState(item?.mainImage || "");

  useEffect(() => {
    if (item) {
      setCurrentImage(item.mainImage);
    }
  }, [item]);

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw] p-0 overflow-hidden shadow-2xl rounded-lg">
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src={currentImage || "https://picsum.photos/1200/600"}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={item.aiHint || "project image"}
          />
        </div>
        
        {item.thumbnails && item.thumbnails.length > 0 && (
          <div className="flex p-3 bg-muted space-x-2 overflow-x-auto">
            {item.thumbnails.map((thumb, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentImage(thumb)} 
                className={`w-20 h-14 relative rounded-md overflow-hidden border-2 ${
                  currentImage === thumb 
                    ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-muted' 
                    : 'border-transparent'
                } hover:border-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-1 focus:ring-offset-muted transition-all duration-200`}
                aria-label={`Ver imagen ${idx + 1}`}
              >
                <Image src={thumb} alt={`Thumbnail ${idx + 1}`} layout="fill" objectFit="cover" className="rounded" data-ai-hint={item.aiHint || "project thumbnail"}/>
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-4 max-h-[calc(90vh-250px)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-foreground">{item.title}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground items-center">
            <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary" /> {item.date}</div>
            <div className="flex items-center"><Tag className="h-4 w-4 mr-2 text-primary" /> {item.category}</div>
            <div className="flex items-center"><User className="h-4 w-4 mr-2 text-primary" /> {item.client}</div>
          </div>

          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            {item.description}
          </DialogDescription>

          {item.features && item.features.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Características principales</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {item.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
              </ul>
            </div>
          )}

          {item.projectLink && (
            <Button asChild variant="default" className="mt-4 group">
              <a href={item.projectLink} target="_blank" rel="noopener noreferrer">
                Ver Proyecto
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          )}
        </div>
        <DialogClose asChild className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="bg-background/50 hover:bg-background/80 rounded-full">
              <X className="h-5 w-5" />
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
