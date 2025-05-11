"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="sobre-nosotros" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-foreground tracking-tight">
              Sobre <span className="text-primary">Nosotros</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Deyconic es una institución que ofrece servicios digitales y físicos a empresas que no tienen presencia en redes sociales o no cuentan con una plataforma profesional que los posicione en los motores de búsqueda. Nuestro objetivo es lograr el impulso digital para pequeñas y grandes empresas y mejorar la interacción empresarial con el cliente.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nuestro equipo de expertos fusiona creatividad y tecnología para potenciar el crecimiento de tu negocio, ya sea en el ámbito digital o físico, alcanzando el máximo nivel de desarrollo empresarial para tu organización. En Deyconic, creemos firmemente que "no hay límites para mejorar" y trabajamos firmemente para convertir esa visión en realidad.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative h-80 md:h-96 lg:h-[450px] rounded-xl overflow-hidden shadow-2xl"
          >
            <Image
              src="https://ik.imagekit.io/ajkl5a98u/Dise%C3%B1o%20sin%20t%C3%ADtulo%20(1).png?updatedAt=1746979975244"
              alt="Equipo de expertos de Deyconic"
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition-transform duration-500"
              data-ai-hint="team collaboration"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
