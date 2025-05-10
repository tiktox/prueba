"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Rocket, X, RotateCcw, CheckCircle, TrendingUp, BarChart } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

const evaluationSchema = z.object({
  companyName: z.string().min(1, "Nombre de la empresa es requerido"),
  companyEmail: z.string().email("Correo electrónico inválido"),
  q1: z.string().optional(), // Example questions
  q2: z.string().optional(),
  q3: z.string().optional(),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

const questions = [
  { id: "q1", text: "¿Su empresa tiene presencia activa en redes sociales?", options: ["Sí", "No", "Parcialmente"] },
  { id: "q2", text: "¿Cuenta con una página web profesional y optimizada?", options: ["Sí", "No", "En desarrollo"] },
  { id: "q3", text: "¿Utiliza herramientas digitales para la gestión de clientes (CRM)?", options: ["Sí", "No", "Considerándolo"] },
];

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EvaluationModal({ isOpen, onClose }: EvaluationModalProps) {
  const [step, setStep] = useState(0); // 0: Intro, 1: Form, 2: Results
  const [results, setResults] = useState({ score: 0, message: "" });

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
  });

  const onSubmit: SubmitHandler<EvaluationFormData> = (data) => {
    console.log("Evaluation Data:", data);
    // Dummy scoring logic
    let score = 0;
    if (data.q1 === "Sí") score += 33;
    if (data.q2 === "Sí") score += 33;
    if (data.q3 === "Sí") score += 34;
    
    let message = "";
    if (score < 50) message = "Hay áreas clave donde podemos ayudarte a mejorar tu presencia digital.";
    else if (score < 80) message = "¡Buen progreso! Podemos ayudarte a optimizar y alcanzar el siguiente nivel.";
    else message = "¡Excelente! Estás en un buen camino. Veamos cómo podemos innovar aún más.";

    setResults({ score, message });
    setStep(2);
  };

  const startEvaluation = () => {
    form.reset();
    setStep(1);
  };
  
  const resetEvaluation = () => {
    form.reset();
    setStep(0);
  };

  const progress = step === 1 ? (Object.values(form.watch()).filter(v => v).length / (Object.keys(form.getValues()).length || 1)) * 100 : (step === 2 ? 100 : 0);


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetEvaluation(); onClose(); }}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden shadow-2xl rounded-lg">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-foreground">Evaluación Empresarial</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
          {step > 0 && <Progress value={progress} className="w-full mt-2 h-2" />}
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <Rocket className="h-16 w-16 text-primary mx-auto" />
                <h3 className="text-xl font-medium text-foreground">Evalue su Empresa con Nosotros</h3>
                <DialogDescription>
                  Descubra el potencial de crecimiento de su negocio con nuestra evaluación digital. Es rápido, fácil y el primer paso hacia la transformación.
                </DialogDescription>
                <Button onClick={startEvaluation} size="lg" className="w-full sm:w-auto group">
                  Comenzar Evaluación <TrendingUp className="ml-2 h-5 w-5 group-hover:animate-pulse"/>
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Nombre de la empresa</Label>
                    <Input id="companyName" {...form.register("companyName")} placeholder="Ej: Mi Empresa S.R.L." className="mt-1"/>
                    {form.formState.errors.companyName && <p className="text-sm text-destructive mt-1">{form.formState.errors.companyName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="companyEmail">Correo electrónico</Label>
                    <Input id="companyEmail" type="email" {...form.register("companyEmail")} placeholder="Ej: contacto@miempresa.com" className="mt-1"/>
                    {form.formState.errors.companyEmail && <p className="text-sm text-destructive mt-1">{form.formState.errors.companyEmail.message}</p>}
                  </div>
                </div>

                {questions.map((q, index) => (
                  <div key={q.id} className="space-y-2">
                    <Label className="font-medium">{index + 1}. {q.text}</Label>
                    <Controller
                      name={q.id as keyof EvaluationFormData}
                      control={form.control}
                      render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                          {q.options.map(opt => (
                            <div key={opt} className="flex items-center space-x-2">
                              <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                              <Label htmlFor={`${q.id}-${opt}`} className="font-normal">{opt}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </div>
                ))}
                
                <Button type="submit" size="lg" className="w-full group">
                  Finalizar Evaluación <CheckCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform"/>
                </Button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-6"
              >
                <BarChart className="h-16 w-16 text-primary mx-auto" />
                <h3 className="text-2xl font-semibold text-foreground">Resultados de la Evaluación</h3>
                <div className="p-6 bg-secondary rounded-lg">
                  <p className="text-5xl font-bold text-primary mb-2">{results.score}%</p>
                  <p className="text-muted-foreground">{results.message}</p>
                </div>
                <p className="text-sm text-muted-foreground">Un consultor de Deyconic se pondrá en contacto pronto para discutir sus resultados y próximos pasos.</p>
                <Button onClick={resetEvaluation} variant="outline" className="w-full sm:w-auto group">
                   <RotateCcw className="mr-2 h-4 w-4 group-hover:rotate-[-90deg] transition-transform" /> Nueva Evaluación
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
