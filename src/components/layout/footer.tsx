
"use client";

import Link from "next/link";
import { Facebook, Linkedin, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { DeyconicLogo } from "@/components/icons/deyconic-logo";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
});

const lightLogoUrl = "https://ik.imagekit.io/ajkl5a98u/logo_1000x1000-removebg-preview.png?updatedAt=1746469003137";
const darkLogoUrl = "https://ik.imagekit.io/ajkl5a98u/1000x1000-removebg-preview2.0.png?updatedAt=1746468946560";

export default function Footer() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof newsletterSchema>) {
    console.log("Newsletter subscription:", values);
    toast({
      title: "¡Suscrito!",
      description: `Gracias por suscribirte con ${values.email}.`,
      variant: "default"
    });
    form.reset();
  }

  return (
    <footer className="bg-muted text-muted-foreground pt-16 pb-8" id="contacto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
          {/* Deyconic Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link href="/" className="inline-block mb-2">
              <DeyconicLogo 
                lightLogoUrl={lightLogoUrl}
                darkLogoUrl={darkLogoUrl}
                width={36}
                height={36}
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Transformamos el futuro digital de las empresas con soluciones innovadoras y personalizadas.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="https://www.facebook.com/deyconic" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="https://www.linkedin.com/in/deyconic/" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></Link>
              <Link href="https://www.instagram.com/deyconic/#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base font-semibold text-foreground mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#hero" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="#servicios" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="#sobre-nosotros" className="hover:text-primary transition-colors">Sobre nosotros</Link></li>
              <li><Link href="#portafolio" className="hover:text-primary transition-colors">Portafolio</Link></li>
            </ul>
          </motion.div>

          {/* Legal */}
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
             <h3 className="text-base font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/politica-privacidad" className="hover:text-primary transition-colors">Política y privacidad</Link></li>
              <li><Link href="/terminos-servicios" className="hover:text-primary transition-colors">Términos de servicios</Link></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-base font-semibold text-foreground mb-4">Suscríbete para recibir las últimas noticias y actualizaciones</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2 items-start">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input type="email" placeholder="Tu email" {...field} className="bg-input border-border focus:ring-primary h-10" />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" size="icon" aria-label="Suscribirse" className="h-10 w-10 flex-shrink-0 bg-primary hover:bg-primary/90">
                  <Send size={18} className="text-primary-foreground"/>
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Deyconic. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

