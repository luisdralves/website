"use client";

import { useReducedMotion } from "motion/react";
import { DynamicCanvas } from "./dynamic-canvas";
import { StaticFallback } from "./static-fallback";

type Props = {
  wrapperHeight?: string;
  canvasHeight?: string;
};

export const GeometricElement = ({ wrapperHeight = "0px", canvasHeight = "100vh" }: Props) => {
  const shouldReduceMotion = useReducedMotion();
  const isReducedMotion = shouldReduceMotion ?? false;

  return (
    <div className="relative w-full overflow-visible" style={{ height: wrapperHeight }}>
      <div
        className="-z-10 -translate-y-1/2 mask-[linear-gradient(to_bottom,transparent,black_50%,transparent)] absolute inset-x-0 top-1/2"
        style={{ height: canvasHeight }}
      >
        {isReducedMotion ? <StaticFallback /> : <DynamicCanvas />}
      </div>
    </div>
  );
};
