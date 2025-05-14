
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Briefcase, Info } from "lucide-react";
import { motion, useAnimation, AnimatePresence, type Variants } from "framer-motion";
// InvestmentModal is imported by the wrapper, not directly here.

const LONG_PRESS_DURATION = 2000; // 2 seconds
const ELECTRIC_BLUE = "hsl(var(--primary))"; 
const NEON_MINT_COLOR = "#2EF2AF";
const DEEP_BLUE_SHOCKWAVE_COLOR = "hsl(var(--primary) / 0.7)";

const PARTICLE_COUNT = 5; 
const LIGHTNING_COUNT = 3; 

interface ParticleState {
  id: number;
  angle: number; 
  radiusFactor: number; 
  size: number; 
}

interface LightningState {
  id: number;
  angle: number;
  lengthFactor: number; 
}

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

  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [lightningStreaks, setLightningStreaks] = useState<LightningState[]>([]);

  const pressTimerRef = useRef<NodeJS.Timeout | number | null>(null);
  const helpTooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleAnimationIntervalRef = useRef<NodeJS.Timeout | null>(null);


  const fabControls = useAnimation(); 
  const haloControls = useAnimation(); 
  const shadowControls = useAnimation(); 
  const progressRingControls = useAnimation(); 
  const particleGroupControls = useAnimation(); 
  const individualParticleControls = useAnimation(); 
  const lightningControls = useAnimation(); 
  const shockwaveControls = useAnimation(); 

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);

      setParticles(Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        angle: (i / PARTICLE_COUNT) * 360,
        radiusFactor: 0.6 + Math.random() * 0.4, 
        size: 1 + Math.random() * 1,
      })));

      setLightningStreaks(Array.from({ length: LIGHTNING_COUNT }, (_, i) => ({
        id: i,
        angle: Math.random() * 360,
        lengthFactor: 0.7 + Math.random() * 0.3,
      })));

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
        if (pressTimerRef.current !== null) {
          if (typeof pressTimerRef.current === 'number') { // interval
            clearInterval(pressTimerRef.current);
          } else { // timeout
            clearTimeout(pressTimerRef.current);
          }
        }
        if (helpTooltipTimerRef.current) clearTimeout(helpTooltipTimerRef.current);
        if (idleAnimationIntervalRef.current) clearInterval(idleAnimationIntervalRef.current);
      }
    }
  }, []);

  // Idle Animations (Halo, Shadow, Lightning)
  useEffect(() => {
    if (!isMounted || prefersReducedMotion || isPressing) {
      if (idleAnimationIntervalRef.current) {
        clearInterval(idleAnimationIntervalRef.current);
        idleAnimationIntervalRef.current = null;
      }
      haloControls.stop();
      shadowControls.stop();
      lightningControls.stop();

      if (prefersReducedMotion && isMounted && !isPressing) {
        haloControls.start({ scale: 1, opacity: 0.2, backgroundColor: ELECTRIC_BLUE, boxShadow: `0 0 10px 2px ${ELECTRIC_BLUE}33`, transition: { duration: 0 }});
        shadowControls.start({ opacity: 0.15, scale: 1, transition: { duration: 0 } });
      }
      return;
    }

    const animateCycle = () => {
      setCurrentHaloColor(prevHaloColor => {
        const nextColor = prevHaloColor === ELECTRIC_BLUE ? NEON_MINT_COLOR : ELECTRIC_BLUE;
        
        haloControls.start({
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.5, 0.1],
          backgroundColor: nextColor,
          boxShadow: [`0 0 15px 3px ${nextColor}4D`, `0 0 25px 8px ${nextColor}80`, `0 0 15px 3px ${nextColor}4D`],
          transition: { duration: 2.5, ease: "easeInOut" },
        });
        shadowControls.start({
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1],
          transition: { duration: 2.5, ease: "easeInOut" },
        });
        lightningControls.start(i => ({
          opacity: [0, 1, 0, 0.5, 0],
          transition: { duration: 0.3 + Math.random() * 0.4, delay: Math.random() * 1.5 + (typeof i === 'number' ? i*0.1 : 0), ease: "circOut" }
        }));
        return nextColor;
      });
    };
    
    if (!idleAnimationIntervalRef.current) { 
      animateCycle();
    }
    const randomDelay = isMounted ? Math.random() * 2000 + 3000 : 3000;
    const intervalId = setInterval(animateCycle, randomDelay);
    idleAnimationIntervalRef.current = intervalId;

    return () => {
      if (idleAnimationIntervalRef.current) {
        clearInterval(idleAnimationIntervalRef.current);
        idleAnimationIntervalRef.current = null;
      }
    };
  }, [isMounted, prefersReducedMotion, isPressing, haloControls, shadowControls, lightningControls]); // Removed currentHaloColor


  const isPressingRef = React.useRef(isPressing);
  useEffect(() => { isPressingRef.current = isPressing; }, [isPressing]);

  const clearExistingPressTimer = () => {
    if (pressTimerRef.current !== null) {
      if (typeof pressTimerRef.current === 'number') { // interval
        clearInterval(pressTimerRef.current);
      } else { // timeout
        clearTimeout(pressTimerRef.current);
      }
      pressTimerRef.current = null;
    }
  };

  const startPress = useCallback(() => {
    clearExistingPressTimer(); 

    if (helpTooltipTimerRef.current) clearTimeout(helpTooltipTimerRef.current);
    setShowHelpTooltip(false);
    setIsPressing(true); 
    setPressProgress(0);

    lightningControls.start({ opacity: 0, transition: {duration: 0.1} }); 

    if (!prefersReducedMotion) {
      progressRingControls.start({
        pathLength: 0, 
        transition: { duration: 0 },
      }).then(() => {
        progressRingControls.start({
          pathLength: 1,
          transition: { duration: LONG_PRESS_DURATION / 1000, ease: "linear" },
        });
      });

      individualParticleControls.start({ opacity: 1, scale: 1, transition: { duration: 0.3 } });
      particleGroupControls.start({
        rotate: [0, 360],
        transition: { duration: 8, ease: "linear", repeat: Infinity } 
      });
      haloControls.start({ scale: 1.1, opacity: 0.3, transition: { duration: 0.3 } });
      
      // Use NodeJS.Timeout for setTimeout
      pressTimerRef.current = setTimeout(() => {
        if (isPressingRef.current) { 
          if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
          
          fabControls.start({ scale: [1, 0.9, 1.2, 1], transition: { duration: 0.4, ease: "circOut", times: [0, 0.3, 0.7, 1] } });
          shockwaveControls.start({
            scale: [0.5, 3], 
            opacity: [0.7, 0],
            transition: { duration: 0.6, ease: [0.55, 0, 0.1, 1] }
          });
          individualParticleControls.start({ opacity: 0, scale: 0.5, transition: { duration: 0.4 } });
          particleGroupControls.stop();
          
          onOpenModal();
          resetPressState(true); 
        }
      }, LONG_PRESS_DURATION);

    } else { 
        let currentProgressVal = 0; 
        // Use number for setInterval
        const intervalId: number = setInterval(() => {
            if (!isPressingRef.current) { 
                clearInterval(intervalId);
                resetPressState(false);
                return;
            }
            currentProgressVal += (100 / (LONG_PRESS_DURATION / 50));
            setPressProgress(Math.min(currentProgressVal, 100) / 100);
            if (currentProgressVal >= 100) {
                clearInterval(intervalId);
                if (isPressingRef.current) {
                    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
                    onOpenModal();
                    resetPressState(true);
                }
            }
        }, 50) as unknown as number; // Cast to number if setInterval returns NodeJS.Timeout in your env
        pressTimerRef.current = intervalId;
    }
  }, [prefersReducedMotion, progressRingControls, onOpenModal, fabControls, shockwaveControls, individualParticleControls, particleGroupControls, haloControls, lightningControls]);


  const cancelPress = useCallback(() => {
    clearExistingPressTimer();
    
    const currentNormalizedProgress = pressProgress; 
    if (isPressingRef.current && currentNormalizedProgress > 0 && currentNormalizedProgress < 0.95) { 
        setShowHelpTooltip(true);
        if (helpTooltipTimerRef.current) clearTimeout(helpTooltipTimerRef.current);
        helpTooltipTimerRef.current = setTimeout(() => setShowHelpTooltip(false), 3000);
    }
    
    resetPressState(false); 
  }, [pressProgress]); 

  const resetPressState = (completed: boolean) => {
    setIsPressing(false); 
    setPressProgress(0);

    if (!prefersReducedMotion) {
        progressRingControls.start({ pathLength: 0, transition: { duration: 0.2 } });
        if (!completed) { 
             individualParticleControls.start({ opacity: 0, scale: 0, transition: { duration: 0.3 } });
        }
        particleGroupControls.stop();
        particleGroupControls.set({ rotate: 0 }); 
        
        if (!completed) {
            shockwaveControls.set({ scale: 0, opacity: 0 }); 
        }
    }
  };


  const handleMouseDown = (e: React.MouseEvent) => { if (e.button === 0) startPress(); };
  const handleTouchStart = () => startPress();
  const handleMouseUpOrLeave = () => { if (isPressingRef.current) cancelPress(); };
  const handleTouchEnd = () => { if (isPressingRef.current) cancelPress(); };


  const handleFocus = () => {
    if (!isMounted || prefersReducedMotion || isPressing) return;
    if (idleAnimationIntervalRef.current) { 
      clearInterval(idleAnimationIntervalRef.current);
      idleAnimationIntervalRef.current = null;
    }
    
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
    if (idleAnimationIntervalRef.current) {
        clearInterval(idleAnimationIntervalRef.current);
        idleAnimationIntervalRef.current = null;
    }
    // Restart idle animation cycle
    const animateCycle = () => {
      setCurrentHaloColor(prevHaloColor => {
        const nextColor = prevHaloColor === ELECTRIC_BLUE ? NEON_MINT_COLOR : ELECTRIC_BLUE;
        haloControls.start({
          scale: [1, 1.3, 1], opacity: [0.1, 0.5, 0.1], backgroundColor: nextColor,
          boxShadow: [`0 0 15px 3px ${nextColor}4D`, `0 0 25px 8px ${nextColor}80`, `0 0 15px 3px ${nextColor}4D`],
          transition: { duration: 2.5, ease: "easeInOut" },
        });
        shadowControls.start({
          opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1],
          transition: { duration: 2.5, ease: "easeInOut" },
        });
        return nextColor;
      });
    };
    if (!idleAnimationIntervalRef.current && isMounted && !prefersReducedMotion && !isPressing) {
        animateCycle(); // Initial call
        const randomDelay = Math.random() * 2000 + 3000;
        idleAnimationIntervalRef.current = setInterval(animateCycle, randomDelay);
    }
  };
  
  const fabInitialAnimation: Variants = useMemo(() => ({
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20, delay: isMounted ? 0.2 : 1.2 } },
  }), [isMounted]);


  if (!isMounted) { 
    return (
      <div className="fixed bottom-[calc(theme(spacing.6)_+_4.5rem)] right-6 z-50 sm:bottom-[calc(theme(spacing.6)_+_4rem)]">
        <Button size="lg" className="relative rounded-full shadow-xl p-4 h-16 w-16 sm:h-auto sm:w-auto sm:px-6 sm:py-3 bg-primary text-primary-foreground opacity-0" aria-hidden="true">
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
        animate={fabControls} 
        onFocus={!prefersReducedMotion ? handleFocus : undefined}
        onBlur={!prefersReducedMotion ? handleBlur : undefined}
        onHoverStart={!prefersReducedMotion ? handleFocus : undefined} 
        onHoverEnd={!prefersReducedMotion ? handleBlur : undefined}   
      >
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-0"
            style={{ backgroundColor: currentHaloColor, zIndex: -1 }}
            animate={haloControls}
          />
        )}
         {!prefersReducedMotion && (
            <motion.div
                className="absolute inset-0 rounded-full bg-black/30 blur-lg"
                style={{ zIndex: -2 }}
                animate={shadowControls}
            />
        )}

        <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-[-50%] w-[200%] h-[200%] pointer-events-none overflow-visible" 
            style={{ zIndex: -1 }} 
            aria-hidden="true"
        >
            {!prefersReducedMotion && isPressing && (
                <motion.circle
                    cx="50" cy="50" r="45" 
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
                    strokeDasharray="283" 
                    strokeDashoffset="283" 
                    animate={progressRingControls} 
                    initial={{ pathLength: 0 }} 
                    transform="rotate(-90 50 50)" 
                />
            )}

            {!prefersReducedMotion && particles.length > 0 && (
                <motion.g animate={particleGroupControls}>
                    {particles.map(p => (
                        <motion.circle
                            key={p.id}
                            custom={p.id}
                            cx={50 + 35 * p.radiusFactor * Math.cos(p.angle * Math.PI / 180)} 
                            cy={50 + 35 * p.radiusFactor * Math.sin(p.angle * Math.PI / 180)}
                            r={p.size}
                            fill={ELECTRIC_BLUE}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={individualParticleControls}
                        />
                    ))}
                </motion.g>
            )}
            
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
            
            {!prefersReducedMotion && (
                <motion.circle
                    cx="50" cy="50" r="25" 
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
                           transition-transform duration-200 ease-in-out ${prefersReducedMotion ? "hover:scale-105 focus:scale-105" : ""}`}
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
      {/* Modal is rendered by the wrapper InvestmentFabWrapper directly */}
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

