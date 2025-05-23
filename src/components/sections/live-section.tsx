
"use client";

import type { UpcomingEvent } from "@/types/event";
import EventCard from "@/components/custom/event-card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, PlusSquare, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const upcomingEventsData: UpcomingEvent[] = [
  {
    id: '1',
    name: 'Webinar: IA en la Automatización de Negocios',
    date: '25 Agosto 2024',
    time: '04:00 PM (GMT-4)',
    modality: 'Virtual',
    locationOrLink: 'https://zoom.us/join/12345', // Placeholder
    linkText: 'Unirme al Webinar',
    status: 'Próximo',
    image: 'https://picsum.photos/seed/webinar-ia-live/600/400',
    aiHint: 'webinar technology',
    description: 'Descubre cómo la Inteligencia Artificial está revolucionando la automatización de procesos empresariales y cómo puedes implementarla en tu organización para optimizar recursos y mejorar la eficiencia.'
  },
  {
    id: '2',
    name: 'Taller Presencial: Estrategias de Marketing Digital Avanzado',
    date: '10 Septiembre 2024',
    time: '09:00 AM - 01:00 PM (GMT-4)',
    modality: 'Presencial',
    locationOrLink: 'Centro de Convenciones Santiago, Sala B', // Placeholder
    linkText: 'Inscribirse Ahora',
    status: 'Próximo',
    image: 'https://picsum.photos/seed/marketing-workshop-live/600/400',
    aiHint: 'workshop business',
    description: 'Aprende estrategias efectivas y avanzadas de marketing digital para potenciar tu marca, atraer más clientes y alcanzar tus objetivos comerciales en el competitivo mercado actual. Cupos limitados.'
  },
  {
    id: '3',
    name: 'Lanzamiento Producto: Deyconic Analytics Suite',
    date: '05 Octubre 2024',
    time: '10:00 AM (GMT-4)',
    modality: 'Virtual',
    locationOrLink: 'https://deyconic.com/live-launch', // Placeholder
    linkText: 'Ver Lanzamiento',
    status: 'Próximo',
    image: 'https://picsum.photos/seed/product-launch-live/600/400',
    aiHint: 'software launch presentation',
    description: 'Sé el primero en conocer nuestra nueva suite de analítica de datos diseñada para transformar la toma de decisiones en tu empresa. Presentación en vivo con demos y Q&A.'
  },
];


export default function LiveSection() {
  return (
    <section id="deyconic-live" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground tracking-tight mb-4">
            Deyconic Live: <span className="text-primary">Innovación en Movimiento</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Participa en nuestras charlas, webinars, ferias y lanzamientos. Mantente al día con las últimas tendencias y oportunidades de crecimiento que Deyconic trae para ti.
          </p>
        </motion.div>

        {/* Próximos Eventos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center mb-8">
            <CalendarCheck className="h-8 w-8 text-primary mr-3" />
            <h3 className="text-3xl font-semibold text-foreground">Próximos Eventos</h3>
          </div>
          {upcomingEventsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEventsData.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay eventos próximos programados. ¡Vuelve pronto!</p>
          )}
           <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button variant="outline" className="group">
                    <PlusSquare className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" />
                    Añadir a mi Calendario (iCal)
                </Button>
                <Button variant="outline" className="group">
                     <Share2 className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" />
                    Compartir Eventos
                </Button>
            </div>
        </motion.div>
      </div>
    </section>
  );
}

