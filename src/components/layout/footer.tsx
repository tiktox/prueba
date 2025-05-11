
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
    });
    form.reset();
  }

  return (
    <footer className="bg-muted text-muted-foreground pt-16 pb-8" id="contacto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Deyconic Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link href="/" className="text-3xl font-bold text-primary flex items-center">
              <DeyconicLogo 
                lightLogoUrl={lightLogoUrl}
                darkLogoUrl={darkLogoUrl}
                className="mr-0" // Removed margin as text is gone
                width={32}
                height={32}
              />
              {/* Deyconic */}
            </Link>
            <p className="text-sm leading-relaxed">
              Transformamos el futuro digital de las empresas con soluciones innovadoras y personalizadas.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/deyconic" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="https://www.linkedin.com/in/deyconic/" aria-label="LinkedIn" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></Link>
              <Link href="https://www.instagram.com/deyconic/#" aria-label="Instagram" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#hero" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="#servicios" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="#sobre-nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="#portafolio" className="hover:text-primary transition-colors">Portafolio</Link></li>
              <li><Link href="/palette-extractor" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">AI Palette Extractor</Link></li>
            </ul>
          </motion.div>

          {/* Placeholder for another section if needed */}
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
             <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Newsletter</h3>
            <p className="text-sm mb-3">Suscríbete para recibir las últimas noticias y actualizaciones.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input type="email" placeholder="Tu email" {...field} className="bg-background border-border focus:ring-primary" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="default" size="icon" aria-label="Suscribirse">
                  <Send size={18} />
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Deyconic. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

