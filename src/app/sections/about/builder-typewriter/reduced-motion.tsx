"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CYCLE_SPEED = 3000;

type ReducedMotionTypewriterProps = {
  prefix: string;
  suffixes: readonly string[];
};

export const ReducedMotionTypewriter = ({ prefix, suffixes }: ReducedMotionTypewriterProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { amount: 1 });
  const [suffixIndex, setSuffixIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setSuffixIndex((i) => (i + 1) % suffixes.length);
    }, CYCLE_SPEED);

    return () => clearInterval(interval);
  }, [isInView, suffixes.length]);

  return (
    <p ref={ref} className="min-h-[2.5em] font-mono text-2xl leading-[1.2] md:text-3xl">
      <span>{prefix}</span>
      <span>{suffixes[suffixIndex]}</span>
    </p>
  );
};
