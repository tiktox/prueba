import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PaletteExtractorForm from "@/components/ai/palette-extractor-form";
import { Sparkles } from "lucide-react";

export default function PaletteExtractorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-4">
            Extractor de Paleta de Colores AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Sube una imagen de tu marca o inspiración y nuestra IA extraerá los colores dominantes para ayudarte a definir tu paleta.
          </p>
        </div>
        <PaletteExtractorForm />
      </main>
      <Footer />
    </div>
  );
}

