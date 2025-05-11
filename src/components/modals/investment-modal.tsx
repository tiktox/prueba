
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Briefcase, Info } from "lucide-react";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestmentModal({
  isOpen,
  onClose,
}: InvestmentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[95vw] p-0 shadow-2xl rounded-lg">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground flex items-center">
              <Briefcase className="h-6 w-6 mr-3 text-primary" />
              Explora nuestras oportunidades de inversión
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            Aquí aparecerán los proyectos disponibles para invertir con Deyconic.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="flex items-start p-4 bg-secondary/50 rounded-md border border-border">
            <Info className="h-6 w-6 mr-3 text-primary flex-shrink-0 mt-1" />
            <div>
                <h3 className="font-medium text-foreground">Próximamente</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Actualmente no hay proyectos de inversión disponibles. Estamos trabajando para traerte oportunidades exclusivas muy pronto. ¡Mantente atento a nuestras actualizaciones!
                </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 pt-0">
            <DialogClose asChild>
                <Button variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
