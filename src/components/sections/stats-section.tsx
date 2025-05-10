"use client";

import AnimatedCounter from "@/components/shared/animated-counter";
import { Briefcase, CheckCircle, Building, Activity } from "lucide-react";
import { motion } from "framer-motion";

const statsData = [
  { count: 103, label: "Proyectos Completados", icon: <Briefcase className="h-10 w-10 text-primary" /> },
  { count: 41, label: "Optimizaciones de Servicios", icon: <CheckCircle className="h-10 w-10 text-primary" /> },
  { count: 3, label: "Empresas Auditadas", icon: <Building className="h-10 w-10 text-primary" /> },
  { count: 13, label: "Proyectos en Curso", icon: <Activity className="h-10 w-10 text-primary" /> },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function StatsSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-background p-8 rounded-xl shadow-lg text-center flex flex-col items-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4">{stat.icon}</div>
              <AnimatedCounter to={stat.count} className="text-5xl font-bold text-primary mb-2" />
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
