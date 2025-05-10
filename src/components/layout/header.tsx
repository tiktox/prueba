
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "#hero", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#sobre-nosotros", label: "Nosotros" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#noticias", label: "Noticias" },
  { href: "#actualizaciones", label: "Actualizaciones" },
  // { href: "#eventos", label: "Eventos" }, // Eventos might be part of updates or news
  // { href: "#preguntas", label: "Preguntas" }, // FAQ section can be added later
  // { href: "#soporte", label: "Soporte" }, // Contact or FAQ
  { href: "#contacto", label: "Contacto" },
  { href: "/palette-extractor", label: "AI Palette", isExternal: true },
];

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
            <Sparkles className="h-8 w-8 mr-2 text-accent" />
            Deyconic
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
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-6">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col space-y-6">
                 <div className="flex items-center"> {/* Removed justify-between, default close button from SheetContent is used */}
                    <Link href="/" className="text-2xl font-bold text-primary flex items-center">
                        <Sparkles className="h-7 w-7 mr-2 text-accent" />
                        Deyconic
                    </Link>
                    {/* The default SheetContent includes an X close button. Removed custom one. */}
                  </div>
                  <nav className="flex flex-col space-y-3">
                    {navLinks.map((link) => (
                      <SheetClose key={link.label} asChild>
                        <Link
                          href={link.href}
                          target={link.isExternal ? "_blank" : undefined}
                          rel={link.isExternal ? "noopener noreferrer" : undefined}
                          className="block py-2 px-3 rounded-md text-lg font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
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
