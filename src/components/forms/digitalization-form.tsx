
"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, FileUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];


const digitalizationFormSchema = z.object({
  // Step 1
  empresa: z.string().min(1, "Nombre de la empresa es requerido"),
  sector: z.string().min(1, "Sector o industria es requerido"),
  ubicacion: z.string().min(1, "Ubicación es requerida"),
  telefono: z.string().min(7, "Número de teléfono inválido").regex(/^\+?[0-9\s-()]+$/, "Formato de teléfono inválido"),
  email: z.string().email("Correo electrónico inválido"),
  web: z.string().url("URL inválida").optional().or(z.literal('')),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),

  // Step 2
  pregunta01: z.string().min(1, "Respuesta requerida"), // Objetivo principal
  pregunta02: z.string().min(1, "Respuesta requerida"), // Funcionalidades principales
  pregunta03: z.string().min(1, "Respuesta requerida"), // Competidores
  pregunta04: z.string().min(1, "Respuesta requerida"), // Sitios de referencia

  // Step 3
  pregunta05: z.string().min(1, "Respuesta requerida"), // Estilo visual
  pregunta06: z.string().min(1, "Respuesta requerida"), // Colores
  pregunta07: z.string().min(1, "Respuesta requerida"), // Logo
  pregunta08: z.string().min(1, "Respuesta requerida"), // Imágenes/recursos
  pregunta09: z.string().min(1, "Respuesta requerida"), // Páginas principales
  pregunta10: z.string().min(1, "Respuesta requerida"), // Blog/Noticias
  pregunta11: z.string().min(1, "Respuesta requerida"), // Secciones página inicio

  // Step 4
  pregunta12: z.string().min(1, "Respuesta requerida"), // Tienda online / Métodos pago
  pregunta13: z.string().min(1, "Respuesta requerida"), // SEO
  pregunta14: z.string().min(1, "Respuesta requerida"), // Tipo alojamiento
  pregunta15: z.enum(["Servidor dedicado", "Alojamiento compartido", "No lo sé", "Mantenimiento y Actualización"]), // Alojamiento/Mantenimiento
  pregunta16: z.string().min(1, "Respuesta requerida"), // Mantenimiento continuo
  pregunta17: z.string().min(1, "Respuesta requerida"), // Actualizaciones frecuentes

  // Step 5
  pregunta18: z.string().optional(), // Detalles adicionales
  pregunta19: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList))
    .optional()
    .refine(files => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine(files => !files || files.length === 0 || ALLOWED_FILE_TYPES.includes(files?.[0]?.type), "Tipo de archivo no soportado."), // Archivos adjuntos
  pregunta20: z.string().min(1, "Respuesta requerida"), // Referir a alguien
  pregunta22: z.string().optional(), // Nombre referido
  pregunta23: z.string().optional(), // Teléfono referido
  pregunta24: z.string().optional(), // Empresa referida
});

type DigitalizationFormData = z.infer<typeof digitalizationFormSchema>;

interface DigitalizationFormProps {
  onSuccess: () => void;
}

const steps = [
  { title: "Información de la Empresa", fields: ["empresa", "sector", "ubicacion", "telefono", "email", "web", "facebook", "instagram", "twitter", "linkedin"] },
  { title: "Objetivos y Funcionalidad", fields: ["pregunta01", "pregunta02", "pregunta03", "pregunta04"] },
  { title: "Diseño y Contenido", fields: ["pregunta05", "pregunta06", "pregunta07", "pregunta08", "pregunta09", "pregunta10", "pregunta11"] },
  { title: "Aspectos Técnicos", fields: ["pregunta12", "pregunta13", "pregunta14", "pregunta15", "pregunta16", "pregunta17"] },
  { title: "Información Adicional", fields: ["pregunta18", "pregunta19", "pregunta20", "pregunta22", "pregunta23", "pregunta24"] },
];

export default function DigitalizationForm({ onSuccess }: DigitalizationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();

  const { control, register, handleSubmit, trigger, formState: { errors } } = useForm<DigitalizationFormData>({
    resolver: zodResolver(digitalizationFormSchema),
    mode: "onChange", // Validate on change for better UX
  });

  const handleNext = async () => {
    const currentFields = steps[currentStep].fields as (keyof DigitalizationFormData)[];
    const isValid = await trigger(currentFields);
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setFormError(null);
      }
    } else {
        setFormError("Por favor, completa todos los campos requeridos en este paso.");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setFormError(null);
    }
  };

  const onSubmit: SubmitHandler<DigitalizationFormData> = async (data) => {
    setIsLoading(true);
    setFormError(null);
    console.log("Formulario de digitalización enviado:", data);

    // Placeholder for actual submission logic (e.g., EmailJS)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example of how to handle file (data.pregunta19)
      if (data.pregunta19 && data.pregunta19.length > 0) {
        const file = data.pregunta19[0];
        console.log("Archivo adjunto:", file.name, file.size, file.type);
        // Here you would typically upload the file to a server or cloud storage
      }

      toast({
        title: "¡Formulario Enviado!",
        description: "Gracias por completar el formulario. Nos pondremos en contacto contigo pronto.",
        variant: "default",
        duration: 5000,
      });
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      setFormError(`Error al enviar el formulario: ${errorMessage}`);
      toast({
        title: "Error de Envío",
        description: `No se pudo enviar el formulario. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Información de la Empresa
        return (
          <div className="space-y-4">
            <div><Label htmlFor="empresa">Nombre de la empresa</Label><Input id="empresa" {...register("empresa")} />{errors.empresa && <p className="text-sm text-destructive mt-1">{errors.empresa.message}</p>}</div>
            <div><Label htmlFor="sector">Sector o industria</Label><Input id="sector" {...register("sector")} />{errors.sector && <p className="text-sm text-destructive mt-1">{errors.sector.message}</p>}</div>
            <div><Label htmlFor="ubicacion">Ubicación de la empresa</Label><Textarea id="ubicacion" {...register("ubicacion")} />{errors.ubicacion && <p className="text-sm text-destructive mt-1">{errors.ubicacion.message}</p>}</div>
            <div><Label htmlFor="telefono">Número de teléfono de contacto</Label><Input type="tel" id="telefono" {...register("telefono")} />{errors.telefono && <p className="text-sm text-destructive mt-1">{errors.telefono.message}</p>}</div>
            <div><Label htmlFor="email">Correo electrónico de contacto</Label><Input type="email" id="email" {...register("email")} />{errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}</div>
            <div><Label htmlFor="web">Página web actual (si aplica)</Label><Input type="url" id="web" {...register("web")} placeholder="https://ejemplo.com"/>{errors.web && <p className="text-sm text-destructive mt-1">{errors.web.message}</p>}</div>
            <Label>Redes sociales de la empresa (opcional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Input id="facebook" {...register("facebook")} placeholder="Facebook URL"/></div>
              <div><Input id="instagram" {...register("instagram")} placeholder="Instagram URL"/></div>
              <div><Input id="twitter" {...register("twitter")} placeholder="Twitter/X URL"/></div>
              <div><Input id="linkedin" {...register("linkedin")} placeholder="LinkedIn URL"/></div>
            </div>
          </div>
        );
      case 1: // Objetivos y Funcionalidad
        return (
          <div className="space-y-4">
            <div><Label htmlFor="pregunta01">¿Cuál es el objetivo principal de la página web? (Ej: Vender, mostrar servicios, captar clientes, etc.)</Label><Textarea id="pregunta01" {...register("pregunta01")} />{errors.pregunta01 && <p className="text-sm text-destructive mt-1">{errors.pregunta01.message}</p>}</div>
            <div><Label htmlFor="pregunta02">¿Cuáles son las principales funcionalidades que necesita su página web? (Ej: Tienda, formularios, chat, citas, CRM)</Label><Textarea id="pregunta02" {...register("pregunta02")} />{errors.pregunta02 && <p className="text-sm text-destructive mt-1">{errors.pregunta02.message}</p>}</div>
            <div><Label htmlFor="pregunta03">¿Quiénes son sus principales competidores en línea?</Label><Textarea id="pregunta03" {...register("pregunta03")} />{errors.pregunta03 && <p className="text-sm text-destructive mt-1">{errors.pregunta03.message}</p>}</div>
            <div><Label htmlFor="pregunta04">¿Hay algún sitio web de referencia que le guste (diseño/funcionalidad)?</Label><Textarea id="pregunta04" {...register("pregunta04")} />{errors.pregunta04 && <p className="text-sm text-destructive mt-1">{errors.pregunta04.message}</p>}</div>
          </div>
        );
      case 2: // Diseño y Contenido
        return (
          <div className="space-y-4">
            <div><Label htmlFor="pregunta05">¿Tiene algún estilo visual específico en mente? (Ej: Moderno, minimalista, corporativo, colorido)</Label><Input id="pregunta05" {...register("pregunta05")} />{errors.pregunta05 && <p className="text-sm text-destructive mt-1">{errors.pregunta05.message}</p>}</div>
            <div><Label htmlFor="pregunta06">¿Qué colores y/o paleta de colores prefiere para su sitio web?</Label><Input id="pregunta06" {...register("pregunta06")} />{errors.pregunta06 && <p className="text-sm text-destructive mt-1">{errors.pregunta06.message}</p>}</div>
            <div><Label htmlFor="pregunta07">¿Quiere incluir su logotipo en el sitio web?</Label><Input id="pregunta07" {...register("pregunta07")} />{errors.pregunta07 && <p className="text-sm text-destructive mt-1">{errors.pregunta07.message}</p>}</div>
            <div><Label htmlFor="pregunta08">¿Qué imágenes o recursos visuales (fotos, videos) desea incluir?</Label><Textarea id="pregunta08" {...register("pregunta08")} />{errors.pregunta08 && <p className="text-sm text-destructive mt-1">{errors.pregunta08.message}</p>}</div>
            <div><Label htmlFor="pregunta09">¿Cuántas páginas principales tendrá su sitio web? (Ej: Inicio, Servicios, Contacto)</Label><Input id="pregunta09" {...register("pregunta09")} />{errors.pregunta09 && <p className="text-sm text-destructive mt-1">{errors.pregunta09.message}</p>}</div>
            <div><Label htmlFor="pregunta10">¿Desea incluir un blog o una sección de noticias?</Label><Input id="pregunta10" {...register("pregunta10")} />{errors.pregunta10 && <p className="text-sm text-destructive mt-1">{errors.pregunta10.message}</p>}</div>
            <div><Label htmlFor="pregunta11">¿Qué secciones principales quiere incluir en la página de inicio? (Ej: Banner, servicios, testimonios)</Label><Textarea id="pregunta11" {...register("pregunta11")} />{errors.pregunta11 && <p className="text-sm text-destructive mt-1">{errors.pregunta11.message}</p>}</div>
          </div>
        );
      case 3: // Aspectos Técnicos
        return (
          <div className="space-y-4">
            <div><Label htmlFor="pregunta12">¿Necesitará una tienda en línea (e-commerce)? De ser así ¿qué métodos de pago desea ofrecer?</Label><Textarea id="pregunta12" {...register("pregunta12")} />{errors.pregunta12 && <p className="text-sm text-destructive mt-1">{errors.pregunta12.message}</p>}</div>
            <div><Label htmlFor="pregunta13">¿Necesita que el sitio esté optimizado para SEO (Search Engine Optimization)?</Label><Input id="pregunta13" {...register("pregunta13")} />{errors.pregunta13 && <p className="text-sm text-destructive mt-1">{errors.pregunta13.message}</p>}</div>
            <div><Label htmlFor="pregunta14">¿Qué tipo de alojamiento web prefiere?</Label><Input id="pregunta14" {...register("pregunta14")} />{errors.pregunta14 && <p className="text-sm text-destructive mt-1">{errors.pregunta14.message}</p>}</div>
            <div>
              <Label>Tipo de Servidor / Mantenimiento:</Label>
              <Controller
                name="pregunta15"
                control={control}
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2 space-y-1">
                    {(["Servidor dedicado", "Alojamiento compartido", "No lo sé", "Mantenimiento y Actualización"] as const).map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`pregunta15-${option}`} />
                        <Label htmlFor={`pregunta15-${option}`} className="font-normal">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.pregunta15 && <p className="text-sm text-destructive mt-1">{errors.pregunta15.message}</p>}
            </div>
            <div><Label htmlFor="pregunta16">¿Desea que gestionemos el mantenimiento continuo de la web?</Label><Input id="pregunta16" {...register("pregunta16")} />{errors.pregunta16 && <p className="text-sm text-destructive mt-1">{errors.pregunta16.message}</p>}</div>
            <div><Label htmlFor="pregunta17">¿Desea realizar actualizaciones frecuentes de contenido?</Label><Input id="pregunta17" {...register("pregunta17")} />{errors.pregunta17 && <p className="text-sm text-destructive mt-1">{errors.pregunta17.message}</p>}</div>
          </div>
        );
      case 4: // Información Adicional
        return (
          <div className="space-y-4">
            <div><Label htmlFor="pregunta18">¿Hay algún detalle o solicitud adicional que desee mencionar?</Label><Textarea id="pregunta18" {...register("pregunta18")} />{errors.pregunta18 && <p className="text-sm text-destructive mt-1">{errors.pregunta18.message}</p>}</div>
            <div>
              <Label htmlFor="pregunta19">Adjunte archivos relevantes (logo, imágenes, docs - máx 5MB)</Label>
              <Input type="file" id="pregunta19" {...register("pregunta19")} accept={ALLOWED_FILE_TYPES.join(",")} className="pt-2"/>
              {errors.pregunta19 && <p className="text-sm text-destructive mt-1">{errors.pregunta19.message}</p>}
            </div>
            <div><Label htmlFor="pregunta20">¿Tiene a alguien a quien pueda referirnos?</Label><Input id="pregunta20" {...register("pregunta20")} />{errors.pregunta20 && <p className="text-sm text-destructive mt-1">{errors.pregunta20.message}</p>}</div>
            <Label>Si nos refirió a alguien (opcional):</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label htmlFor="pregunta22" className="text-xs">Nombre del referido</Label><Input id="pregunta22" {...register("pregunta22")} />{errors.pregunta22 && <p className="text-sm text-destructive mt-1">{errors.pregunta22.message}</p>}</div>
                <div><Label htmlFor="pregunta23" className="text-xs">Teléfono del referido</Label><Input type="tel" id="pregunta23" {...register("pregunta23")} />{errors.pregunta23 && <p className="text-sm text-destructive mt-1">{errors.pregunta23.message}</p>}</div>
                <div className="sm:col-span-2"><Label htmlFor="pregunta24" className="text-xs">Empresa del referido</Label><Input id="pregunta24" {...register("pregunta24")} />{errors.pregunta24 && <p className="text-sm text-destructive mt-1">{errors.pregunta24.message}</p>}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Progress value={progress} className="w-full h-2 mb-4" />
      <h3 className="text-lg font-medium text-foreground">{steps[currentStep].title}</h3>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: currentStep > 0 ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: currentStep > 0 ? -50 : 50 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {formError && (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md"
        >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="break-words">{formError}</span>
        </motion.div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || isLoading} className="group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Anterior
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={handleNext} disabled={isLoading} className="group">
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading} className="group">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Enviar Formulario
                <CheckCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
