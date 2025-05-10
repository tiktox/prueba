"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  to: number;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({ to, duration = 1.5, className }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, to, {
        duration,
        onUpdate(value) {
          setCount(Math.round(value));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to, duration]);

  return <span ref={ref} className={className}>{count}</span>;
}
