
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { DeyconicLogo } from "@/components/icons/deyconic-logo";

const navLinks = [
  { href: "#hero", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#sobre-nosotros", label: "Nosotros" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#noticias", label: "Noticias" },
  { href: "#actualizaciones", label: "Actualizaciones" },
  { href: "#contacto", label: "Contacto" },
  { href: "/palette-extractor", label: "AI Palette", isExternal: true },
];

const lightLogoUrl = "https://ik.imagekit.io/ajkl5a98u/logo_1000x1000-removebg-preview.png?updatedAt=1746469003137";
const darkLogoUrl = "https://ik.imagekit.io/ajkl5a98u/1000x1000-removebg-preview2.0.png?updatedAt=1746468946560";


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-primary flex items-center">
            <DeyconicLogo 
              lightLogoUrl={lightLogoUrl}
              darkLogoUrl={darkLogoUrl}
              className="mr-2"
              width={40}
              height={40}
            />
            <span className="hidden sm:inline">Deyconic</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Button key={link.label} variant="ghost" asChild className="text-foreground hover:text-primary hover:bg-primary/10">
                {link.isExternal ? (
                  <Link href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</Link>
                ) : (
                  <Link href={link.href}>{link.label}</Link>
                )}
              </Button>
            ))}
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-0">
                <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle className="text-left">
                         <Link href="/" className="text-2xl font-bold text-primary flex items-center">
                            <DeyconicLogo 
                                lightLogoUrl={lightLogoUrl}
                                darkLogoUrl={darkLogoUrl}
                                className="mr-2" 
                                width={32} 
                                height={32} 
                            />
                            Deyconic
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                 <div className="p-6 flex flex-col space-y-3">
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <SheetClose key={link.label} asChild>
                        <Link
                          href={link.href}
                          target={link.isExternal ? "_blank" : undefined}
                          rel={link.isExternal ? "noopener noreferrer" : undefined}
                          className="block py-2.5 px-3 rounded-md text-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
