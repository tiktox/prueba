
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
import { X, Lightbulb } from "lucide-react";
import DigitalizationForm from "@/components/forms/digitalization-form";

interface DigitalizationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DigitalizationFormModal({
  isOpen,
  onClose,
}: DigitalizationFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] p-0 flex flex-col shadow-2xl rounded-lg">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground flex items-center">
              <Lightbulb className="h-6 w-6 mr-3 text-primary" />
              Digitaliza tu Empresa
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            Completa este formulario para que podamos entender tus necesidades y ayudarte a transformar tu negocio.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-6">
          <DigitalizationForm onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
