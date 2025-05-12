// src/components/custom/inversion-button.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Briefcase, Info } from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const LONG_PRESS_DURATION = 2000; // 2 seconds
const ELECTRIC_BLUE = "#00C2FF";
const NEON_MINT = "#2EF2AF";
const DEEP_BLUE_SHOCKWAVE = "#0A2C5C"; // For shockwave

interface InversionButtonProps {
  onOpenModal: () => void;
}

export default function InversionButton({ onOpenModal }: InversionButtonProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [currentHaloColor, setCurrentHaloColor] = useState(ELECTRIC_BLUE);

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const helpTooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

  const haloControls = useAnimation();
  const shadowControls = useAnimation();
  const progressControls = useAnimation();
  const buttonControls = useAnimation();
  const shockwaveControls = useAnimation();


  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Idle Halo Animation
  useEffect(() => {
    if (!isMounted || prefersReducedMotion) {
      if (prefersReducedMotion) {
        haloControls.start({
            scale: 1,
            opacity: 0.3,
            boxShadow: `0 0 10px 2px ${ELECTRIC_BLUE}33`, // Simplified static glow
            transition: { duration: 0 }
        });
        shadowControls.start({
            opacity: 0.2,
            scale: 1,
            transition: { duration: 0 }
        });
      }
      return;
    }

    let pulseTimeoutId: NodeJS.Timeout;
    const scheduleNextPulse = () => {
      const duration = Math.random() * (5000 - 3000) + 3000; // 3-5 seconds
      pulseTimeoutId = setTimeout(() => {
        setCurrentHaloColor(prev => prev === ELECTRIC_BLUE ? NEON_MINT : ELECTRIC_BLUE);
        haloControls.start({
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          transition: { duration: 1.5, ease: "easeInOut" },
        });
        shadowControls.start({
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
          transition: { duration: 1.5, ease: "easeInOut" },
        });
        scheduleNextPulse();
      }, duration);
    };
    scheduleNextPulse();
    return () => clearTimeout(pulseTimeoutId);
  }, [isMounted, prefersReducedMotion, haloControls, shadowControls, currentHaloColor]);


  const startPress = useCallback(() => {
    if (helpTooltipTimerRef.current) clearTimeout(helpTooltipTimerRef.current);
    setShowHelpTooltip(false);
    setIsPressing(true);
    setPressProgress(0);

    if (!prefersReducedMotion) {
        progressControls.start({
        pathLength: 0,
        transition: { duration: 0 },
        });
        progressControls.start({
        pathLength: 1,
        transition: { duration: LONG_PRESS_DURATION / 1000, ease: "linear" },
        });
    }


    pressTimerRef.current = setTimeout(() => {
      if (isPressingRef.current) { // Check if still pressing
        if (!prefersReducedMotion) {
            buttonControls.start({ scale: [1, 1.1, 0.95, 1], transition: { duration: 0.2, ease: "circOut" } });
            shockwaveControls.start({
                scale: [0, 2.5],
                opacity: [0.7, 0],
                transition: { duration: 0.4, ease: [0.55, 0, 0.1, 1] }
            });
        }
        onOpenModal();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(10);
        }
        resetPressState();
      }
    }, LONG_PRESS_DURATION);

  }, [prefersReducedMotion, progressControls, onOpenModal, buttonControls, shockwaveControls]);

  const isPressingRef = React.useRef(isPressing);
  useEffect(() => {
    isPressingRef.current = isPressing;
  }, [isPressing]);

  const cancelPress = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (isPressingRef.current && pressProgress > 0 && pressProgress < 1 && !prefersReducedMotion) { // Check if it was a real press attempt
         // Only show tooltip if it was a short press, not just a click
        if (pressProgress * LONG_PRESS_DURATION < LONG_PRESS_DURATION - 100) { // Heuristic: not too close to full press
            setShowHelpTooltip(true);
            helpTooltipTimerRef.current = setTimeout(() => setShowHelpTooltip(false), 3000);
        }
    }
    
    resetPressState();
  }, [pressProgress, prefersReducedMotion]);

  const resetPressState = () => {
    setIsPressing(false);
    setPressProgress(0);
    if (!prefersReducedMotion) {
        progressControls.start({ pathLength: 0, transition: { duration: 0.2 } });
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) startPress(); // Only left click
  };
  const handleTouchStart = () => startPress();

  const handleMouseUp = () => {
    if (isPressingRef.current) cancelPress();
  };
  const handleMouseLeave = () => {
    if (isPressingRef.current) cancelPress();
  };
  const handleTouchEnd = () => {
    if (isPressingRef.current) cancelPress();
  };

  const handleFocus = () => {
    if (!isMounted || prefersReducedMotion) return;
    haloControls.stop();
    haloControls.start({
      scale: [1, 1.4, 1],
      opacity: [0.4, 0.8, 0.4],
      transition: { duration: 1.5 / 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: (Math.random() * 2000 + 3000) / 1.2 },
    });
     shadowControls.start({
        opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1],
        transition: { duration: (1.5 / 1.2), ease: "easeInOut", repeat: Infinity, repeatDelay: (Math.random() * (5000 - 3000) + 3000) / 1.2 },
    });
  };

  const handleBlur = () => {
    if (!isMounted || prefersReducedMotion) return;
    haloControls.stop(); // Stop accelerated animation
    shadowControls.stop();
    // Restart idle animation (logic is in useEffect for halo)
    setCurrentHaloColor(prev => prev === ELECTRIC_BLUE ? NEON_MINT : ELECTRIC_BLUE); // Force re-trigger of idle animation
  };
  
  const fabInitialAnimation = {
    scale: isMounted ? 1 : 0, // Start scaled up if mounted, otherwise animate from 0
    opacity: isMounted ? 1 : 0,
  };
  const fabAnimateAnimation = {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20, delay: isMounted ? 0 : 1.2 },
  };


  if (!isMounted) {
    return ( // Basic fallback for SSR or before mount
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
        initial={fabInitialAnimation}
        animate={buttonControls} // Controlled by fabControls for click, can also use standard animate
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
        whileHover={prefersReducedMotion ? { scale: 1.05 } : { scale: 1.1 }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {/* Halo */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-0"
            style={{ backgroundColor: currentHaloColor, zIndex: -1, boxShadow: `0 0 20px 5px ${currentHaloColor}66` }}
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

        {/* Shockwave on complete */}
        {!prefersReducedMotion && (
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                style={{ translateX: '-0%', translateY: '-0%', pointerEvents: 'none', zIndex:0 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={shockwaveControls}
            />
        )}

        <Tooltip open={showHelpTooltip} onOpenChange={setShowHelpTooltip}>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className={`relative rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary hover:bg-primary/90 text-primary-foreground overflow-hidden
                          ${isPressing && !prefersReducedMotion ? "scale-95 bg-primary/80" : ""} 
                          hover:scale-105 focus:scale-105 transition-transform duration-200 ease-in-out`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              aria-label="Mantén presionado para ver Proyectos de Inversión"
              aria-pressed={isPressing}
            >
              <Briefcase className="h-6 w-6 sm:mr-2" />
              <span className="hidden sm:inline">Proyectos de Inversión</span>
              
              {/* Progress Indicator */}
              {!prefersReducedMotion && isPressing && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)"}}>
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-current text-primary/30"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-current text-accent"
                    strokeWidth="3"
                    strokeDasharray="100"
                    animate={progressControls} // pathLength
                    initial={{ pathLength: 0 }}
                  />
                </svg>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <p className="flex items-center"><Info className="h-4 w-4 mr-2" />Mantén presionado para ver los proyectos.</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>
    </TooltipProvider>
  );
}

/**
 * @file InversionButton.tsx
 * @description A floating action button for "Proyectos de Inversión" with long-press activation and complex animations.
 *
 * Core Functionality:
 * - Displays a FAB for "Proyectos de Inversión".
 * - Activates on a 2-second long press (touch or mouse).
 * - Shows a progress ring during the long press.
 * - On successful long press: triggers `onOpenModal` prop, plays completion animation, haptic feedback.
 * - On short click/tap: shows a help tooltip.
 * - On interrupted press: resets progress and state.
 *
 * Animations:
 * - Idle State:
 *   - Luminous halo pulses pseudo-randomly (3-5s), alternating Electric Blue & Neon Mint.
 *   - Button shadow "breathes" in sync with halo.
 *   - [Simplified] Shockwave on completion rather than continuous orbital wave.
 * - Hover/Focus State:
 *   - Halo pulse accelerates by ~20%.
 *   - Button border/halo intensifies.
 * - Active Long Press State:
 *   - Progress ring animates fill over 2s.
 *   - Button has subtle scale/background feedback.
 * - Long Press Completion:
 *   - [Simplified] Shockwave emanates from button.
 *   - Button "bounces" (scales).
 * - Reduced Motion:
 *   - Disables halo pulse, shockwave, complex progress. Simple static glow/shadow.
 *   - Progress indicator animation is simplified or removed.
 *
 * Props:
 * - onOpenModal: () => void; // Callback invoked when the long press successfully completes.
 *
 * Customization (Internal Constants):
 * - LONG_PRESS_DURATION: Duration for long press in ms (default: 2000ms).
 * - Halo pulse timing, colors (ELECTRIC_BLUE, NEON_MINT), shockwave color (DEEP_BLUE_SHOCKWAVE) are internal.
 */
