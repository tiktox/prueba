// src/components/custom/inversion-button.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Briefcase, Info } from "lucide-react";
import { motion, useAnimation, AnimatePresence, type Variants } from "framer-motion";
// Removed InvestmentModal import as it's handled by InvestmentFabWrapper

const LONG_PRESS_DURATION = 2000; // 2 seconds
const ELECTRIC_BLUE = "hsl(var(--primary))"; // Using HSL variable from globals.css
const NEON_MINT_COLOR = "#2EF2AF";
const DEEP_BLUE_SHOCKWAVE_COLOR = "hsl(var(--primary) / 0.7)"; // Derived from primary for shockwave fill

const PARTICLE_COUNT = 5; // Number of orbital particles
const LIGHTNING_COUNT = 3; // Number of lightning streaks

interface ParticleState {
  id: number;
  angle: number; // Initial angle for orbit
  radiusFactor: number; // Distance from center (0.5 to 1.0 of base radius)
  size: number; // Particle size
}

interface LightningState {
  id: number;
  angle: number;
  lengthFactor: number; // 0.7 to 1.0 of max length
}


/**
 * @file InversionButton.tsx
 * @description A floating action button for "Proyectos de Inversión" with long-press activation and complex animations.
 *
 * Core Functionality:
 * - Displays a FAB for "Proyectos de Inversión".
 * - Activates on a 2-second long press (touch or mouse).
 * - Shows a progress ring and orbital particles during the long press.
 * - On successful long press: triggers `onOpenModal` prop, plays completion animation (bounce, shockwave), haptic feedback.
 * - On short click/tap: shows a help tooltip.
 * - On interrupted press: resets progress and state.
 *
 * Animations:
 * - Idle State (Energy Accumulation):
 *   - Luminous halo pulses pseudo-randomly (3-5s), alternating Electric Blue & Neon Mint.
 *   - Button shadow "breathes" in sync with halo.
 *   - Micro-lightning streaks randomly appear.
 * - Active Long Press State (Orbital Charge):
 *   - Progress ring (SVG) fills over 2s.
 *   - Fine particles (SVG) become visible and orbit slowly around the button.
 * - Long Press Completion (Unlock & Transformation):
 *   - Button "bounces" (scales).
 *   - Circular shockwave (SVG) expands outwards and fades.
 *   - Particles collapse/dissipate.
 * - Reduced Motion:
 *   - Disables complex halo pulse, orbiting particles, lightning, shockwave. Simple static glow/shadow.
 *   - Progress indicator animation is simplified.
 *
 * Props:
 * - onOpenModal: () => void; // Callback invoked when the long press successfully completes.
 */
interface InversionButtonProps {
  onOpenModal: () => void;
}

export default function InversionButton({ onOpenModal }: InversionButtonProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0); // 0 to 1
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentHaloColor, setCurrentHaloColor] = useState(ELECTRIC_BLUE);

  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [lightningStreaks, setLightningStreaks] = useState<LightningState[]>([]);

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const helpTooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleAnimationIntervalRef = useRef<NodeJS.Timeout | null>(null);


  const fabControls = useAnimation(); // For main button scale/bounce
  const haloControls = useAnimation(); // For the div-based halo/glow
  const shadowControls = useAnimation(); // For the div-based shadow
  const progressRingControls = useAnimation(); // For SVG progress ring
  const particleGroupControls = useAnimation(); // For rotating the particle group
  const individualParticleControls = useAnimation(); // For opacity/scale of individual particles
  const lightningControls = useAnimation(); // For lightning streak opacity
  const shockwaveControls = useAnimation(); // For SVG shockwave circle

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);

      // Initialize particles
      setParticles(Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        angle: (i / PARTICLE_COUNT) * 360,
        radiusFactor: 0.6 + Math.random() * 0.4, // Spread them out a bit
        size: 1 + Math.random() * 1,
      })));

      // Initialize lightning
      setLightningStreaks(Array.from({ length: LIGHTNING_COUNT }, (_, i) => ({
        id: i,
        angle: Math.random() * 360,
        lengthFactor: 0.7 + Math.random() * 0.3,
      })));

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
        if (helpTooltipTimerRef.current) clearTimeout(helpTooltipTimerRef.current);
        if (idleAnimationIntervalRef.current) clearInterval(idleAnimationIntervalRef.current);

      }
    }
  }, []);

  // Idle Animations (Halo, Shadow, Lightning)
  useEffect(() => {
    if (!isMounted || prefersReducedMotion) {
      if (prefersReducedMotion) { // Static reduced motion appearance
        haloControls.start({ scale: 1, opacity: 0.2, backgroundColor: ELECTRIC_BLUE, boxShadow: `0 0 10px 2px ${ELECTRIC_BLUE}33`, transition: { duration: 0 }});
        shadowControls.start({ opacity: 0.15, scale: 1, transition: { duration: 0 } });
      }
      return;
    }

    const animateIdleEffects = () => {
      // Halo Pulse
      setCurrentHaloColor(prev => prev === ELECTRIC_BLUE ? NEON_MINT_COLOR : ELECTRIC_BLUE);
      haloControls.start({
        scale: [1, 1.3, 1],
        opacity: [0.1, 0.5, 0.1], // Softer idle halo
        backgroundColor: currentHaloColor, // Will use next color due to state update timing
        boxShadow: [`0 0 15px 3px ${currentHaloColor}4D`, `0 0 25px 8px ${currentHaloColor}80`, `0 0 15px 3px ${currentHaloColor}4D`],
        transition: { duration: 2.5, ease: "easeInOut" },
      });
      shadowControls.start({
        opacity: [0.2, 0.4, 0.2],
        scale: [1, 1.05, 1],
        transition: { duration: 2.5, ease: "easeInOut" },
      });

      // Lightning
      lightningControls.start(i => ({
        opacity: [0, 1, 0, 0.5, 0],
        transition: { duration: 0.3 + Math.random() * 0.4, delay: Math.random() * 1.5 + i*0.1, ease: "circOut" }
      }));
    };
    
    animateIdleEffects(); // Initial call
    idleAnimationIntervalRef.current = setInterval(animateIdleEffects, Math.random() * 2000 + 3000); // 3-5 seconds

    return () => {
      if (idleAnimationIntervalRef.current) clearInterval(idleAnimationIntervalRef.current);
      haloControls.stop();
      shadowControls.stop();
      lightningControls.stop();
    };
  }, [isMounted, prefersReducedMotion, haloControls, shadowControls, lightningControls, currentHaloColor]);


  const isPressingRef = React.useRef(isPressing);
  useEffect(() => { isPressingRef.current = isPressing; }, [isPressing]);

  const startPress = useCallback(() => {
    if (helpTooltipTimerRef.current) clearTimeout(helpTooltipTimerRef.current);
    setShowHelpTooltip(false);
    setIsPressing(true);
    setPressProgress(0);

    if (idleAnimationIntervalRef.current) clearInterval(idleAnimationIntervalRef.current); // Stop idle anims
    lightningControls.start({ opacity: 0, transition: {duration: 0.1} }); // Hide lightning quickly

    if (!prefersReducedMotion) {
      progressRingControls.start({
        pathLength: 0, // Reset before starting
        transition: { duration: 0 },
      }).then(() => {
        progressRingControls.start({
          pathLength: 1,
          transition: { duration: LONG_PRESS_DURATION / 1000, ease: "linear" },
        });
      });

      // Make particles visible and start orbiting
      individualParticleControls.start({ opacity: 1, scale: 1, transition: { duration: 0.3 } });
      particleGroupControls.start({
        rotate: [0, 360],
        transition: { duration: 8, ease: "linear", repeat: Infinity } // Slow orbit
      });
      // Intensify halo slightly during press
      haloControls.start({ scale: 1.1, opacity: 0.3, transition: { duration: 0.3 } });

    } else { // Reduced motion progress
        let currentProgressValue = 0; // Renamed from currentProgress to avoid conflict with outer scope
        const interval = setInterval(() => {
            currentProgressValue += (100 / (LONG_PRESS_DURATION / 50));
            setPressProgress(Math.min(currentProgressValue, 100) / 100);
            if (currentProgressValue >= 100) clearInterval(interval);
        }, 50);
        // Store interval ref to clear it in cancelPress or on completion
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current); // Clear previous timer if any for progress
         // @ts-ignore
        pressTimerRef.current = interval; // Re-purpose for progress interval
    }


    // Main long press timer
    const longPressCompletionTimer = setTimeout(() => {
      if (isPressingRef.current) { // Check if still pressing
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
        
        if (!prefersReducedMotion) {
          fabControls.start({ scale: [1, 0.9, 1.2, 1], transition: { duration: 0.4, ease: "circOut", times: [0, 0.3, 0.7, 1] } });
          shockwaveControls.start({
            scale: [0.5, 3], // Start from button size, expand significantly
            opacity: [0.7, 0],
            transition: { duration: 0.6, ease: [0.55, 0, 0.1, 1] }
          });
          // Particles dissipate
          individualParticleControls.start({ opacity: 0, scale: 0.5, transition: { duration: 0.4 } });
          particleGroupControls.stop();
        }
        
        onOpenModal();
        resetPressState(true); // Pass true to indicate completion
      }
    }, LONG_PRESS_DURATION);
    // If not reduced motion, store this main timer. If reduced, previous one is progress.
    if (!prefersReducedMotion && pressTimerRef.current) clearTimeout(pressTimerRef.current)
    if (!prefersReducedMotion) pressTimerRef.current = longPressCompletionTimer;


  }, [prefersReducedMotion, progressRingControls, onOpenModal, fabControls, shockwaveControls, individualParticleControls, particleGroupControls, haloControls, lightningControls]);


  const cancelPress = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current); // For main long press timer
      // @ts-ignore // If it was a progress interval for reduced motion
      if (prefersReducedMotion && pressTimerRef.current?.hasOwnProperty('_id')) clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    
    // Only show tooltip if it was a short press, not just a click that didn't start the timer.
    // pressProgress is 0-1 for non-reduced, 0-100 for reduced. Normalize for check.
    const currentNormalizedProgress = prefersReducedMotion ? pressProgress : pressProgress * (LONG_PRESS_DURATION / 1000) / (LONG_PRESS_DURATION / 1000); // This normalization seems off, should be simpler
    if (isPressingRef.current && pressProgress > 0 && pressProgress < 0.95) { // Simplified check based on 0-1 scale
        setShowHelpTooltip(true);
        helpTooltipTimerRef.current = setTimeout(() => setShowHelpTooltip(false), 3000);
    }
    
    resetPressState(false); // Pass false for cancellation
  }, [pressProgress, prefersReducedMotion]);

  const resetPressState = (completed: boolean) => {
    setIsPressing(false);
    setPressProgress(0);

    if (!prefersReducedMotion) {
        progressRingControls.start({ pathLength: 0, transition: { duration: 0.2 } });
        if (!completed) { // Only hide if not completed, completion has its own particle animation
             individualParticleControls.start({ opacity: 0, scale: 0, transition: { duration: 0.3 } });
        }
        particleGroupControls.stop();
        particleGroupControls.start({ rotate: 0, transition: { duration: 0 } }); // Reset rotation
        
        // Reset shockwave if cancelled before completion
        if (!completed) {
            shockwaveControls.start({ scale: 0, opacity: 0, transition: { duration: 0 } });
        }
    }
    // Restart idle animations (handled by useEffect dependency change on isMounted/prefersReducedMotion or direct call if needed)
    // For now, rely on the useEffect re-triggering or ensure a manual restart here.
    if (!idleAnimationIntervalRef.current && isMounted && !prefersReducedMotion) {
        const animateIdleEffects = () => {
            setCurrentHaloColor(prev => prev === ELECTRIC_BLUE ? NEON_MINT_COLOR : ELECTRIC_BLUE);
            haloControls.start({ scale: [1, 1.3, 1], opacity: [0.1, 0.5, 0.1], backgroundColor: currentHaloColor, boxShadow: [`0 0 15px 3px ${currentHaloColor}4D`, `0 0 25px 8px ${currentHaloColor}80`, `0 0 15px 3px ${currentHaloColor}4D`], transition: { duration: 2.5, ease: "easeInOut" }});
            shadowControls.start({ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1], transition: { duration: 2.5, ease: "easeInOut" }});
            lightningControls.start(i => ({ opacity: [0, 1, 0, 0.5, 0], transition: { duration: 0.3 + Math.random() * 0.4, delay: Math.random() * 1.5 + i*0.1, ease: "circOut" }}));
        };
        animateIdleEffects();
        idleAnimationIntervalRef.current = setInterval(animateIdleEffects, Math.random() * 2000 + 3000);
    }
  };


  const handleMouseDown = (e: React.MouseEvent) => { if (e.button === 0) startPress(); };
  const handleTouchStart = () => startPress();
  const handleMouseUpOrLeave = () => { if (isPressingRef.current) cancelPress(); };
  const handleTouchEnd = () => { if (isPressingRef.current) cancelPress(); };


  const handleFocus = () => {
    if (!isMounted || prefersReducedMotion || isPressing) return;
    if (idleAnimationIntervalRef.current) clearInterval(idleAnimationIntervalRef.current);
    
    haloControls.start({
        scale: [1, 1.4, 1], opacity: [0.2, 0.7, 0.2], backgroundColor: currentHaloColor,
        boxShadow: [`0 0 20px 5px ${currentHaloColor}66`, `0 0 30px 10px ${currentHaloColor}99`, `0 0 20px 5px ${currentHaloColor}66`],
        transition: { duration: 2.5 / 1.2, ease: "easeInOut", repeat: Infinity }
    });
    shadowControls.start({
        opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1],
        transition: { duration: 2.5 / 1.2, ease: "easeInOut", repeat: Infinity }
    });
  };

  const handleBlur = () => {
    if (!isMounted || prefersReducedMotion || isPressing) return;
    haloControls.stop(); 
    shadowControls.stop();
    // Restart idle animation loop (logic is in useEffect, will re-trigger or call resetPressState(false) which handles it)
    resetPressState(false);
  };
  
  const fabInitialAnimation: Variants = useMemo(() => ({
    initial: { scale: isMounted ? 1 : 0, opacity: isMounted ? 1 : 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20, delay: isMounted ? 0 : 1.2 } },
  }), [isMounted]);


  if (!isMounted) { // Basic fallback for SSR or before mount
    return (
      <div className="fixed bottom-[calc(theme(spacing.6)_+_4.5rem)] right-6 z-50 sm:bottom-[calc(theme(spacing.6)_+_4rem)]">
        <Button size="lg" className="relative rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary text-primary-foreground">
          <Briefcase className="h-6 w-6 sm:mr-2" />
          <span className="hidden sm:inline">Proyectos de Inversión</span>
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        className="fixed bottom-[calc(theme(spacing.6)_+_4.5rem)] right-6 z-50 sm:bottom-[calc(theme(spacing.6)_+_4rem)]"
        variants={fabInitialAnimation}
        initial="initial"
        animate={fabControls} // Use fabControls for the main button's dynamic animations like bounce
        whileHover={prefersReducedMotion ? { scale: 1.05 } : undefined} // Simpler hover for reduced motion
        onFocus={handleFocus}
        onBlur={handleBlur}
        onHoverStart={!prefersReducedMotion ? handleFocus : undefined} // Use handleFocus for hover too
        onHoverEnd={!prefersReducedMotion ? handleBlur : undefined}   // Use handleBlur for hover end
      >
        {/* Halo */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-0"
            style={{ backgroundColor: currentHaloColor, zIndex: -1 }}
            animate={haloControls}
          />
        )}
        {/* Dynamic Shadow */}
         {!prefersReducedMotion && (
            <motion.div
                className="absolute inset-0 rounded-full bg-black/30 blur-lg"
                style={{ zIndex: -2 }}
                animate={shadowControls}
            />
        )}

        {/* SVG Container for Progress, Particles, Lightning, Shockwave */}
        <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-[-50%] w-[200%] h-[200%] pointer-events-none overflow-visible" // Increased size for effects
            style={{ zIndex: -1 }} // Behind button but above halo/shadow
            aria-hidden="true"
        >
            {/* Progress Indicator Ring */}
            {!prefersReducedMotion && isPressing && (
                <motion.circle
                    cx="50" cy="50" r="45" // Relative to 100x100 viewBox
                    fill="none"
                    stroke="hsl(var(--accent) / 0.3)"
                    strokeWidth="3"
                />
            )}
            {!prefersReducedMotion && isPressing && (
                 <motion.circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="3"
                    strokeDasharray="283" // 2 * PI * 45
                    strokeDashoffset="283"
                    animate={progressRingControls} // Controls pathLength from 1 (full) to 0 (empty for strokeDashoffset)
                    initial={{ pathLength: 0 }} // pathLength animates from 0 to 1
                    transform="rotate(-90 50 50)" // Start from top
                />
            )}

            {/* Orbital Particles */}
            {!prefersReducedMotion && particles.length > 0 && (
                <motion.g animate={particleGroupControls}>
                    {particles.map(p => (
                        <motion.circle
                            key={p.id}
                            custom={p.id}
                            cx={50 + 35 * p.radiusFactor * Math.cos(p.angle * Math.PI / 180)} // Positioned within 100x100
                            cy={50 + 35 * p.radiusFactor * Math.sin(p.angle * Math.PI / 180)}
                            r={p.size}
                            fill={ELECTRIC_BLUE}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={individualParticleControls}
                        />
                    ))}
                </motion.g>
            )}
            
            {/* Lightning Streaks */}
            {!prefersReducedMotion && lightningStreaks.length > 0 && (
                <g>
                    {lightningStreaks.map(l => (
                        <motion.line
                            key={l.id}
                            custom={l.id}
                            x1="50" y1="50"
                            x2={50 + 40 * l.lengthFactor * Math.cos(l.angle * Math.PI / 180)}
                            y2={50 + 40 * l.lengthFactor * Math.sin(l.angle * Math.PI / 180)}
                            stroke={NEON_MINT_COLOR}
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            initial={{ opacity: 0 }}
                            animate={lightningControls}
                        />
                    ))}
                </g>
            )}
            
            {/* Shockwave on complete */}
            {!prefersReducedMotion && (
                <motion.circle
                    cx="50" cy="50" r="25" // Start from button-ish size
                    fill={DEEP_BLUE_SHOCKWAVE_COLOR}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={shockwaveControls}
                />
            )}
        </svg>


        <Tooltip open={showHelpTooltip} onOpenChange={setShowHelpTooltip}>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className={`relative rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground overflow-hidden
                          ${isPressing && !prefersReducedMotion ? "scale-95 bg-primary/80" : ""} 
                           transition-transform duration-200 ease-in-out hover:scale-105 focus:scale-105`} // Basic CSS fallback
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              aria-label="Mantén presionado para ver Proyectos de Inversión"
              aria-pressed={isPressing}
            >
              <Briefcase className="h-6 w-6 sm:mr-2" />
              <span className="hidden sm:inline">Proyectos de Inversión</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <p className="flex items-center"><Info className="h-4 w-4 mr-2" />Mantén presionado para ver los proyectos.</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
      {/* InvestmentModal is now handled by InvestmentFabWrapper */}
    </TooltipProvider>
  );
}

