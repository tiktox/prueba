
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import InvestmentModal from "@/components/modals/investment-modal";
import { motion, useAnimation, type Variants } from "framer-motion";

/**
 * @file InversionButton.tsx
 * @description A floating action button for "Proyectos de Inversión" with complex animations.
 *
 * Core Functionality:
 * - Displays a floating button, typically for "Proyectos de Inversión".
 * - Manages the open/close state of an associated InvestmentModal using `useState`.
 * - Implements complex animations for idle, hover/focus, and click states using Framer Motion.
 * - Uses SVG for orbital particles/shockwave effects.
 * - Adapts animations for users with `prefers-reduced-motion`.
 * - Includes micro-interactions like dynamic shadows and haptic feedback.
 *
 * Animation Details:
 * - Idle State:
 *   - Luminous halo pulses pseudo-randomly every 3-5 seconds.
 *   - Halo color smoothly alternates between Electric Blue (var(--primary)) and Neon Mint.
 *   - Button shadow "breathes" in sync with the halo.
 * - Hover/Focus State:
 *   - Halo pulse accelerates by 20%.
 *   - Halo edge brightness/intensity increases.
 *   - Orbital particles (SVG circles) appear and pulse gently.
 * - Click State:
 *   - Orbital particles collapse towards the center.
 *   - A shockwave emanates from the button (cubic-bezier: 0.55, 0, 0.1, 1).
 *   - Button "bounces" (scales 1 -> 0.8 -> 1.1 -> 1).
 *   - Modal opens after animations, with haptic feedback on mobile.
 * - Reduced Motion:
 *   - Orbital particles and complex halo animations are disabled.
 *   - A simple, subtle light pulse effect is used for the halo.
 *   - Basic scale change on hover/focus.
 *
 * Customization Constants:
 * - `HALO_PULSE_DURATION_MIN`, `HALO_PULSE_DURATION_MAX`: Control idle halo pulse timing (seconds).
 * - `SHOCKWAVE_DURATION`: Duration of the shockwave animation on click (seconds).
 * - `BOUNCE_DURATION`: Duration of the button bounce animation on click (seconds).
 * - `PARTICLE_COUNT`: Number of orbital particles.
 * - `CUBIC_BEZIER_EASING`: Easing array for shockwave and particle collapse.
 * - `NEON_MINT_COLOR`: Secondary color for halo pulse.
 *
 * CSS Fallback:
 * - Includes basic `hover:scale-105 focus:scale-105` via Tailwind classes for non-JS or Framer Motion unavailable scenarios.
 */

// --- Animation Constants ---
const HALO_PULSE_DURATION_MIN = 3; // seconds
const HALO_PULSE_DURATION_MAX = 5; // seconds
const SHOCKWAVE_DURATION = 0.6; // seconds
const BOUNCE_DURATION = 0.3; // seconds
const PARTICLE_COUNT = 5;
const CUBIC_BEZIER_EASING = [0.55, 0, 0.1, 1];
const NEON_MINT_COLOR = "#2EF2AF"; // Neon Mint

interface ParticlePosition {
  cx: string;
  cy: string;
  r: number;
}

export default function InversionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentHaloColor, setCurrentHaloColor] = useState("var(--primary)");
  const [particlePositions, setParticlePositions] = useState<ParticlePosition[]>([]);
  
  const fabControls = useAnimation();
  const particleControls = useAnimation();
  const haloControls = useAnimation();
  const shadowControls = useAnimation();
  const shockwaveControls = useAnimation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);

      const positions = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
        const radius = 30; 
        return {
          cx: `${50 + (radius / 2.2) * Math.cos(angle)}%`,
          cy: `${50 + (radius / 2.2) * Math.sin(angle)}%`,
          r: Math.random() * 1.5 + 1, 
        };
      });
      setParticlePositions(positions);
      
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      haloControls.start({
        scale: [1, 1.03, 1], opacity: [0.3, 0.5, 0.3], // More subtle pulse
        backgroundColor: "var(--primary)", // Fixed color
        transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
      });
      shadowControls.start({
        opacity: [0.15, 0.25, 0.15], scale: [1, 1.02, 1],
        transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
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
        shadowControls.start({
          opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1],
          transition: { duration: 1.5, ease: "easeInOut" },
        });
        scheduleNextPulse();
      }, duration * 1000);
    };
    scheduleNextPulse();
    return () => clearTimeout(pulseTimeoutId);
  }, [prefersReducedMotion, haloControls, shadowControls, currentHaloColor]); // Added currentHaloColor to dependencies

  const handleFabClick = async () => {
    if (prefersReducedMotion) {
      setIsModalOpen(true);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
      return;
    }

    particleControls.start(i => ({
      cx: "50%", cy: "50%", opacity: 0, scale: 0,
      transition: { duration: SHOCKWAVE_DURATION * 0.7, ease: CUBIC_BEZIER_EASING, delay: i * 0.02 },
    }));

    shockwaveControls.start({
      scale: [0, 2.5], opacity: [1, 0],
      transition: { duration: SHOCKWAVE_DURATION, ease: CUBIC_BEZIER_EASING },
    });
    
    await fabControls.start({
      scale: [1, 0.8, 1.1, 1], 
      transition: { duration: BOUNCE_DURATION, times: [0, 0.4, 0.7, 1], ease: "circOut" },
    });

    setIsModalOpen(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    
    // Reset particles after a delay slightly longer than their collapse animation
    setTimeout(() => {
        particleControls.start(i => ({
            opacity: 0,
            scale: 0,
            // Reset cx, cy to their original positions if they should reappear on hover
            // For now, just ensure they are hidden
            cx: particlePositions[i]?.cx || "50%", 
            cy: particlePositions[i]?.cy || "50%",
            transition: { duration: 0 } 
        }));
    }, (SHOCKWAVE_DURATION * 0.7 + PARTICLE_COUNT * 0.02 + 0.1) * 1000);


  };
  
  const fabVariants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20, delay: 1.2 } },
  };
  
  const handleHoverStart = () => {
    if (prefersReducedMotion || particlePositions.length === 0) {
        if (!prefersReducedMotion) fabControls.start({ scale: 1.1 }); // Basic scale for non-reduced even if particles fail
        return;
    }
    fabControls.start({ scale: 1.1, transition: { duration: 0.2 } });
    haloControls.stop(); 
    haloControls.start({ 
      scale: [1, 1.4, 1], opacity: [0, 0.8, 0],
      transition: { duration: 1.5 / 1.2, ease: "easeInOut" }, // 20% faster
    });
    shadowControls.start({
      opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1],
      transition: { duration: 1.5 / 1.2, ease: "easeInOut" },
    });

    particleControls.start(i => ({
      cx: particlePositions[i].cx, cy: particlePositions[i].cy,
      opacity: [0, 0.7, 0.3, 0.7, 0], // Pulse opacity
      scale: [0.5, 1, 0.8, 1, 0.5], // Pulse scale
      transition: { 
          duration: 1.2 + (Math.random() * 0.5), // Slightly variable duration for each particle
          delay: i * 0.05, 
          repeat: Infinity, 
          repeatDelay: 0.3 + (Math.random() * 0.4), // Variable repeat delay
          ease: "easeInOut" 
      }
    }));
  };

  const handleHoverEnd = () => {
    if (prefersReducedMotion) {
        fabControls.start({ scale: 1 }); // Reset scale for non-reduced
        return;
    }
    fabControls.start({ scale: 1 }); 
    
    // Restart idle pulse
    if (!prefersReducedMotion) { // Ensure this only runs if not reduced motion
        const duration = Math.random() * (HALO_PULSE_DURATION_MAX - HALO_PULSE_DURATION_MIN) + HALO_PULSE_DURATION_MIN;
        // Ensure haloControls are only restarted if not in reduced motion
        haloControls.start({
            scale: [1, 1.3, 1], opacity: [0, 0.7, 0],
            transition: { duration: 1.5, ease: "easeInOut", delay: duration / 3 }, 
        });
        shadowControls.start({
           opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1],
           transition: { duration: 1.5, ease: "easeInOut", delay: duration / 3 },
        });
    }
    particleControls.start({ opacity: 0, scale: 0, transition: {duration: 0.3} });
  };
  
  const hoverFocusProps = prefersReducedMotion 
    ? {} // CSS handles hover for reduced motion via Tailwind classes
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
        animate={fabControls} // Use fabControls for initial animation too
        {...hoverFocusProps}
        whileTap={prefersReducedMotion ? { scale: 0.95 } : { scale: 0.9 }}
      >
        <motion.div
            style={{ ...haloBaseStyle, backgroundColor: currentHaloColor, zIndex: -1 }}
            animate={haloControls}
            className="opacity-0" 
        />
        <motion.div
            style={{ ...haloBaseStyle, zIndex: -2 }}
            animate={shadowControls}
            className="bg-black/30 blur-lg" // Ensure this is not too strong
        />
        
        {!prefersReducedMotion && particlePositions.length > 0 && (
            <svg
                viewBox="0 0 64 64" 
                style={{
                    position: 'absolute', top: '-50%', left: '-50%',
                    width: '200%', height: '200%', 
                    pointerEvents: 'none', zIndex: 0, 
                    overflow: 'visible'
                }}
                aria-hidden="true"
            >
                {particlePositions.map((pos, i) => (
                <motion.circle
                    key={i}
                    custom={i} 
                    cx={pos.cx}
                    cy={pos.cy}
                    r={pos.r}
                    fill="hsl(var(--primary))"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={particleControls}
                />
                ))}
            </svg>
        )}
        
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
              aria-hidden="true"
          />
        )}

        <Button
          size="lg"
          variant="default"
          className="relative rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground overflow-hidden transition-transform duration-200 ease-in-out hover:scale-105 focus:scale-105"
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
