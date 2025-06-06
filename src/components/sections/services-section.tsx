
"use client";

import { ListChecks, Cpu, Lightbulb, Rocket, Network, Landmark, Clapperboard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const servicesData = [
  {
    icon: <ListChecks className="h-10 w-10 text-primary mb-4" />,
    title: "Gestión de Proyectos",
    description: "Desde la planificación hasta la ejecución y optimización de tus proyectos empresariales.",
  },
  {
    icon: <Cpu className="h-10 w-10 text-primary mb-4" />,
    title: "Digitalización de Empresas",
    description: "Transformamos tu negocio con soluciones digitales innovadoras y automatización de procesos.",
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary mb-4" />,
    title: "Innovación y Desarrollo",
    description: "Incubación de startups y generación de estrategias disruptivas para tu negocio.",
  },
  {
    icon: <Rocket className="h-10 w-10 text-primary mb-4" />,
    title: "Impulso Empresarial",
    description: "Mentorías, networking y financiamiento estratégico para nuevos empresarios.",
  },
  {
    icon: <Network className="h-10 w-10 text-primary mb-4" />,
    title: "Zonas Francas y Operadores Logísticos",
    description: "Impulsar la eficiencia operativa, la visibilidad de la cadena de suministro y la resiliencia logística mediante la digitalización inteligente y el cumplimiento proactivo.",
  },
  {
    icon: <Landmark className="h-10 w-10 text-primary mb-4" />,
    title: "Despachos de Abogados y Firmas Legales",
    description: "Modernizar la práctica legal, potenciar la eficiencia de los profesionales, asegurar la máxima confidencialidad y mejorar la experiencia del cliente a través de soluciones LegalTech.",
  },
  {
    icon: <Clapperboard className="h-10 w-10 text-primary mb-4" />,
    title: "Youtubers, Influencers y Creadores de Contenido Digital",
    description: "Maximizar el impacto y alcance del contenido, diversificar las fuentes de monetización, optimizar la gestión de la comunidad y profesionalizar la operación creativa.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function ServicesSection() {
  return (
    <section id="servicios" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground tracking-tight mb-4">
            Servicios que <span className="text-primary">Ofrecemos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada servicio cuenta con un enfoque personalizado para satisfacer las necesidades únicas de cada cliente.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="h-full flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 rounded-lg">
                <CardHeader className="items-center pt-6">
                  {service.icon}
                  <CardTitle className="text-xl font-semibold text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <CardDescription className="text-muted-foreground leading-relaxed text-sm">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
