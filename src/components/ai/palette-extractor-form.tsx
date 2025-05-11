
"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { extractColorPalette, type ExtractColorPaletteInput, type ExtractColorPaletteOutput } from "@/ai/flows/extract-color-palette";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ImageUp, Palette, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  imageFile: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList))
    .refine(files => files?.length > 0, "Se requiere una imagen.")
    .refine(files => {
        if (typeof window === 'undefined' || !(files instanceof FileList) || files.length === 0) return true; // Skip on server or if not FileList
        return files?.[0]?.size <= 5 * 1024 * 1024;
      }, "El tamaño máximo de la imagen es 5MB.")
    .refine(files => {
        if (typeof window === 'undefined' || !(files instanceof FileList) || files.length === 0) return true; // Skip on server or if not FileList
        return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(files?.[0]?.type);
      }, "Formato de imagen no soportado. Use JPG, PNG, WEBP o GIF."
    ),
});

type FormData = z.infer<typeof formSchema>;

export default function PaletteExtractorForm() {
  const [extractedColors, setExtractedColors] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const imageFile = watch("imageFile");

  useEffect(() => {
    if (imageFile && imageFile.length > 0 && typeof window !== "undefined") {
      const file = imageFile[0];
      if (file instanceof File) { // Check if it's a File object
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null); // Reset if not a File (e.g., during SSR with z.any())
      }
    } else {
      setPreviewImage(null);
    }
  }, [imageFile]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setExtractedColors(null);

    if (!data.imageFile || data.imageFile.length === 0) {
      setError("Por favor, selecciona un archivo de imagen.");
      setIsLoading(false);
      return;
    }

    const file = data.imageFile[0];
    
    // Ensure FileReader is used only on client
    if (typeof window === "undefined" || !(file instanceof File)) {
        setError("Error al procesar el archivo. Inténtalo de nuevo.");
        setIsLoading(false);
        return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const imageUri = reader.result as string;
      try {
        const input: ExtractColorPaletteInput = { imageUri };
        const result: ExtractColorPaletteOutput = await extractColorPalette(input);
        setExtractedColors(result.colors);
        toast({
          title: "¡Paleta Extraída!",
          description: "Se han extraído los colores de tu imagen.",
          variant: "default",
        });
      } catch (err) {
        console.error("Error extracting color palette:", err);
        const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
        setError(`Error al extraer la paleta: ${errorMessage}`);
        toast({
          title: "Error",
          description: `No se pudo extraer la paleta de colores. ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Error al leer el archivo de imagen.");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const copyToClipboard = (color: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(color);
        toast({
        title: "Copiado",
        description: `${color} copiado al portapapeles.`,
        });
    }
  };

  return (
    <Card className="max-w-xl mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Palette className="mr-3 h-7 w-7 text-primary" />
          Carga tu Imagen
        </CardTitle>
        <CardDescription>
          Sube una imagen (JPG, PNG, WEBP, GIF - máx 5MB) para extraer su paleta de colores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="imageFile" className="text-base">Archivo de Imagen</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="imageFile" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                    {previewImage ? (
                         <motion.img 
                            src={previewImage} 
                            alt="Previsualización" 
                            className="h-full w-full object-contain p-2 rounded-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                         />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageUp className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                        </div>
                    )}
                    <Input id="imageFile" type="file" accept="image/*" {...register("imageFile")} className="hidden" />
                </label>
            </div>
            {errors.imageFile && <p className="text-sm text-destructive mt-1">{errors.imageFile.message}</p>}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </motion.div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 group">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Extrayendo...
              </>
            ) : (
              <>
                Extraer Paleta <Palette className="ml-2 h-5 w-5 group-hover:animate-pulse"/>
              </>
            )}
          </Button>
        </form>

        <AnimatePresence>
        {extractedColors && extractedColors.length > 0 && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-foreground">Colores Extraídos:</h3>
            <div className="flex flex-wrap gap-3">
              {extractedColors.map((color, index) => (
                <motion.div
                  key={index}
                  className="relative group p-1 border border-border rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="w-16 h-16 rounded" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity rounded">
                    <span className="text-white text-xs font-mono">{color}</span>
                  </div>
                </motion.div>
              ))}
            </div>
             <Button variant="outline" onClick={() => { setExtractedColors(null); setPreviewImage(null); reset(); }} className="mt-6 w-full">
                Limpiar y Empezar de Nuevo
            </Button>
          </motion.div>
        )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

