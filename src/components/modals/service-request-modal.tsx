
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { X, ShoppingBag, Send } from "lucide-react";

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const servicesData = [
  { title: "Gestión de Proyectos" },
  { title: "Digitalización de Empresas" },
  { title: "Innovación y Desarrollo" },
  { title: "Impulso Empresarial" },
  { title: "Zonas Francas y Operadores Logísticos" },
  { title: "Despachos de Abogados y Firmas Legales" },
  { title: "Youtubers, Influencers y Creadores de Contenido Digital" },
];

const WHATSAPP_NUMBER = "18299315704"; // Number without '+' or special characters

export default function ServiceRequestModal({
  isOpen,
  onClose,
}: ServiceRequestModalProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendRequest = () => {
    if (!selectedService) {
      toast({
        title: "Selección Requerida",
        description: "Por favor, selecciona un servicio antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    const message = encodeURIComponent(
      `Hola, me gustaría solicitar información sobre el servicio de: ${selectedService}`
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank");
    }
    onClose(); // Close modal after attempting to open WhatsApp
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setSelectedService(null); // Reset selection on close
      }
      onClose();
    }}>
      <DialogContent className="sm:max-w-md w-[95vw] p-0 shadow-2xl rounded-lg flex flex-col max-h-[50vh]">
        <DialogHeader className="p-6 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground flex items-center">
              <ShoppingBag className="h-6 w-6 mr-3 text-primary" />
              Solicitar Servicio
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            Elige el servicio que te interesa y presiona Enviar para contactarnos por WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow p-6 min-h-0"> 
          {/* min-h-0 is important for flex-grow to work correctly with scrollarea in some flex contexts */}
          <RadioGroup value={selectedService ?? undefined} onValueChange={setSelectedService} className="space-y-3">
            {servicesData.map((service) => (
              <div key={service.title} className="flex items-center space-x-3 p-3 border border-border rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={service.title} id={service.title.replace(/\s+/g, '-')} />
                <Label htmlFor={service.title.replace(/\s+/g, '-')} className="text-base font-normal cursor-pointer flex-1">
                  {service.title}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
        
        <DialogFooter className="p-6 pt-4 border-t border-border flex-shrink-0">
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSendRequest} className="group" disabled={!selectedService}>
            Enviar por WhatsApp
            <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
