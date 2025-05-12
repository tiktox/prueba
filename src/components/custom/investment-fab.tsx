
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import InvestmentModal from "@/components/modals/investment-modal";
import { motion, useAnimation, type Variants } from "framer-motion";

/**
 * @file InvestmentFab.tsx
 * @description A floating action button for "Investment Projects" with complex animations.
 *
 * @component InvestmentFab
 *
 * @props None directly, but animation timings and easings can be adjusted within the component's constants.
 *
 * Animation Details:
 * - Idle State: Light halo pulse (alternating Electric Blue & Neon Mint) every 3-5s. Gentle "breathing" shadow.
 * - Hover/Focus: Pulse accelerates by 20%, halo intensifies. Orbital particles appear and pulse gently.
 * - Click:
 *   1. Orbital particles collapse towards the center.
 *   2. A shockwave emanates from the button (cubic-bezier: 0.55, 0, 0.1, 1).
 *   3. Button briefly "bounces" (scales 1 -> 0.8 -> 1.1 -> 1).
 *   4. Modal opens with haptic feedback on mobile.
 * - Reduced Motion: Degrades to a simple light pulse and scale change on hover.
 *
 * Customization:
 * - `HALO_PULSE_DURATION_MIN`, `HALO_PULSE_DURATION_MAX`: Control idle halo pulse timing.
 * - `SHOCKWAVE_DURATION`: Controls shockwave animation duration on click.
 * - `BOUNCE_DURATION`: Controls button bounce animation on click.
 * - `PARTICLE_COUNT`: Number of orbital particles.
 * - Colors: Electric Blue (var(--primary)), Neon Mint (#2EF2AF). Orbital wave: var(--primary) to transparent.
 */

// --- Animation Constants ---
const HALO_PULSE_DURATION_MIN = 3; // seconds
const HALO_PULSE_DURATION_MAX = 5; // seconds
const SHOCKWAVE_DURATION = 0.6; // seconds
const BOUNCE_DURATION = 0.3; // seconds
const PARTICLE_COUNT = 5;
const CUBIC_BEZIER_EASING = [0.55, 0, 0.1, 1]; // For shockwave & particle collapse
const NEON_MINT_COLOR = "#2EF2AF"; // Neon Mint color for halo

interface ParticlePosition {
  cx: string;
  cy: string;
  r: number;
}

export default function InvestmentFab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentHaloColor, setCurrentHaloColor] = useState("var(--primary)"); // Electric Blue
  const [particlePositions, setParticlePositions] = useState<ParticlePosition[]>([]);
  
  const fabControls = useAnimation();
  const particleControls = useAnimation();
  const haloControls = useAnimation();
  const shadowControls = useAnimation();
  const shockwaveControls = useAnimation();

  // Detect prefers-reduced-motion and initialize particle positions
  useEffect(() => {
    //This check ensures that window-dependent code runs only on the client-side.
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);

      // Generate particle positions on client side
      const positions = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
        const radius = 30; // px, distance from button center for SVG viewbox
        return {
          cx: `${50 + (radius / 2.2) * Math.cos(angle)}%`,
          cy: `${50 + (radius / 2.2) * Math.sin(angle)}%`,
          r: Math.random() * 1.5 + 1, // random radius 1-2.5px
        };
      });
      setParticlePositions(positions);
      
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Idle animations (Halo & Shadow pulse)
  useEffect(() => {
    if (prefersReducedMotion) {
      haloControls.start({
        scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5],
        transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
      });
      shadowControls.start({
        opacity: [0.2, 0.3, 0.2], scale: [1, 1.03, 1],
        transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
      });
      return () => {
        haloControls.stop();
        shadowControls.stop();
      };
    }

    let pulseTimeoutId: NodeJS.Timeout;
    const scheduleNextPulse = () => {
      const duration = Math.random() * (HALO_PULSE_DURATION_MAX - HALO_PULSE_DURATION_MIN) + HALO_PULSE_DURATION_MIN;
      pulseTimeoutId = setTimeout(() => {
        setCurrentHaloColor(prev => prev === "var(--primary)" ? NEON_MINT_COLOR : "var(--primary)");
        haloControls.start({
          scale: [1, 1.3, 1], opacity: [0, 0.7, 0],
          transition: { duration: 1.5, ease: "easeInOut" },
        });
        shadowControls.start({ // Dynamic shadow "breathes" with halo
          opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1],
          transition: { duration: 1.5, ease: "easeInOut" },
        });
        scheduleNextPulse();
      }, duration * 1000);
    };
    scheduleNextPulse();
    return () => clearTimeout(pulseTimeoutId);
  }, [prefersReducedMotion, haloControls, shadowControls]);

  // FAB click handler
  const handleFabClick = async () => {
    if (prefersReducedMotion) {
      setIsModalOpen(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
      return;
    }

    // 1. Orbital particles collapse
    particleControls.start(i => ({
      cx: "50%", cy: "50%", opacity: 0, scale: 0,
      transition: { duration: SHOCKWAVE_DURATION * 0.7, ease: CUBIC_BEZIER_EASING, delay: i * 0.02 },
    }));

    // 2. Shockwave
    shockwaveControls.start({
      scale: [0, 2.5], opacity: [1, 0],
      transition: { duration: SHOCKWAVE_DURATION, ease: CUBIC_BEZIER_EASING },
    });
    
    // 3. Button bounce (scales 1 -> 0.8 -> 1.1 -> 1)
    await fabControls.start({
      scale: [1, 0.8, 1.1, 1], 
      transition: { duration: BOUNCE_DURATION, times: [0, 0.4, 0.7, 1], ease: "circOut" },
    });

    // 4. Open modal & haptic feedback
    setIsModalOpen(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);

    // Reset particles for next interaction
    setTimeout(() => particleControls.start({ opacity: 0, scale: 0, transition: { duration: 0 } }), SHOCKWAVE_DURATION * 1000);
  };

  // FAB Variants for hover/focus/tap and initial animation
  const fabVariants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20, delay: 1.2 } },
  };
  
  const handleHoverStart = () => {
    if (prefersReducedMotion || particlePositions.length === 0) return;
    fabControls.start({ scale: 1.1, transition: { duration: 0.2 } });
    haloControls.stop(); // Stop current idle pulse
    haloControls.start({ // Pulse accelerates by 20%, halo intensifies
      scale: [1, 1.4, 1], opacity: [0, 0.8, 0], // Intensified opacity
      transition: { duration: 1.5 / 1.2, ease: "easeInOut" }, // 20% faster
    });
    shadowControls.start({
      opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1], // Intensified shadow
      transition: { duration: 1.5 / 1.2, ease: "easeInOut" },
    });
    // Orbital particles appear and pulse gently
    particleControls.start(i => ({
      cx: particlePositions[i].cx, cy: particlePositions[i].cy,
      opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5],
      transition: { duration: 1.2, delay: i * 0.05, repeat: Infinity, repeatDelay: 0.3, ease: "easeInOut" }
    }));
  };

  const handleHoverEnd = () => {
    if (prefersReducedMotion) return;
    fabControls.start({ scale: 1 }); 
    // Restart idle pulse after a delay to avoid immediate re-trigger if hover is quickly reapplied
    const duration = Math.random() * (HALO_PULSE_DURATION_MAX - HALO_PULSE_DURATION_MIN) + HALO_PULSE_DURATION_MIN;
    haloControls.start({
      scale: [1, 1.3, 1], opacity: [0, 0.7, 0],
      transition: { duration: 1.5, ease: "easeInOut", delay: duration / 3 }, // Short delay before restart
    });
    shadowControls.start({
       opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1],
       transition: { duration: 1.5, ease: "easeInOut", delay: duration / 3 },
    });
    particleControls.start({ opacity: 0, scale: 0, transition: {duration: 0.3} });
  };
  
  const hoverFocusProps = prefersReducedMotion 
    ? { whileHover: { scale: 1.05 }, whileFocus: { scale: 1.05 } } // CSS fallback for reduced motion
    : {
        onHoverStart: handleHoverStart,
        onHoverEnd: handleHoverEnd,
        onFocus: handleHoverStart, 
        onBlur: handleHoverEnd,    
      };
  
  const haloBaseStyle: React.CSSProperties = {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: "50%", pointerEvents: "none",
  };


  return (
    <>
      <motion.div
        className="fixed bottom-[calc(theme(spacing.6)_+_4.5rem)] right-6 z-50 sm:bottom-[calc(theme(spacing.6)_+_4rem)]"
        variants={fabVariants}
        initial="initial"
        animate={fabControls}
        {...hoverFocusProps}
      >
        {/* Halo (dynamic color: Electric Blue / Neon Mint) */}
        <motion.div
            style={{ ...haloBaseStyle, backgroundColor: currentHaloColor, zIndex: -1 }}
            animate={haloControls}
            className="opacity-0" 
        />
        {/* Breathing Shadow */}
        <motion.div
            style={{ ...haloBaseStyle, zIndex: -2 }}
            animate={shadowControls}
            className="bg-black/30 blur-lg"
        />
        
        {/* Particles SVG (orbital wave: deep blue -> transparent) */}
        {!prefersReducedMotion && particlePositions.length > 0 && (
            <svg
                viewBox="0 0 64 64" 
                style={{
                    position: 'absolute', top: '-50%', left: '-50%',
                    width: '200%', height: '200%', 
                    pointerEvents: 'none', zIndex: 0, 
                    overflow: 'visible'
                }}
            >
                {particlePositions.map((pos, i) => (
                <motion.circle
                    key={i}
                    custom={i} 
                    cx={pos.cx}
                    cy={pos.cy}
                    r={pos.r}
                    fill="hsl(var(--primary))" // Deep blue (Electric Blue)
                    initial={{ opacity: 0, scale: 0 }}
                    animate={particleControls} // Fades to opacity 0 for transparent effect
                />
                ))}
            </svg>
        )}
        
        {/* Shockwave effect container */}
        {!prefersReducedMotion && (
          <motion.div
              style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: '100%', height: '100%',
                  borderRadius: '50%',
                  border: '2px solid hsl(var(--primary) / 0.7)',
                  translateX: '-50%', translateY: '-50%',
                  pointerEvents: 'none',
                  zIndex: 0, 
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={shockwaveControls}
          />
        )}

        <Button
          size="lg"
          variant="default"
          className="relative rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground overflow-hidden"
          // Simple CSS scale on hover for reduced motion (Framer Motion also handles this if active)
          style={prefersReducedMotion ? { transition: 'transform 0.2s ease-in-out', transform: 'scale(1)' } : {}} 
          onClick={handleFabClick}
          aria-label="Proyectos de Inversión"
        >
          <Briefcase className="h-6 w-6 sm:mr-2" />
          <span className="hidden sm:inline">Proyectos de Inversión</span>
        </Button>
      </motion.div>
      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

