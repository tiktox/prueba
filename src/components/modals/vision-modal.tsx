"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

interface VisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisionModal({ isOpen, onClose }: VisionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden shadow-2xl rounded-lg">
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src="https://ik.imagekit.io/ajkl5a98u/fffffffff.jpg?updatedAt=1746201245099"
            alt="Banner Visión Deyconic"
            layout="fill"
            objectFit="cover"
            data-ai-hint="abstract futuristic"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
           <DialogHeader className="absolute bottom-0 left-0 p-6 w-full">
            <DialogTitle className="text-3xl font-bold text-white">Nuestra Visión</DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-4">
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            En Deyconic, visualizamos ser la empresa líder a nivel nacional e internacional en innovación empresarial y tecnológica. Nuestro compromiso es potenciar la competitividad de nuestros clientes y elevar la calidad de vida de nuestros colaboradores, impulsando el crecimiento y generando oportunidades que transformen positivamente nuestro entorno.
          </DialogDescription>
          <p className="text-base text-muted-foreground leading-relaxed">
            Nos esforzamos por crear un impacto positivo en la sociedad mediante la generación de empleo, el apoyo al emprendimiento y la democratización del acceso a soluciones tecnológicas que permitan a individuos y empresas alcanzar su máximo potencial.
          </p>
        </div>
        <DialogClose asChild className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
