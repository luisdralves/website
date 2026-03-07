"use client";

import { useReducedMotion } from "motion/react";
import { DynamicTypewriter } from "./dynamic";
import { ReducedMotionTypewriter } from "./reduced-motion";
import type { KeySequence } from "./sequence";

type BuilderTypewriterProps = {
  prefix: string;
  suffixes: readonly string[];
  sequence: KeySequence;
};

export const BuilderTypewriter = ({ prefix, suffixes, sequence }: BuilderTypewriterProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <ReducedMotionTypewriter prefix={prefix} suffixes={suffixes} />;
  }

  return <DynamicTypewriter sequence={sequence} />;
};
