"use client";

import { m } from "motion/react";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";

export const MagneticHoverShowcase = () => {
  const defaultHover = useMagneticSpringHover();
  const strongMagnet = useMagneticSpringHover({
    magnetStrength: 0.5,
    scaleAmount: 1.08,
  });

  const subtleHover = useMagneticSpringHover({
    magnetStrength: 0.15,
    scaleAmount: 1.02,
    shadowElevation: 4,
  });

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-semibold text-3xl">Magnetic Hover Showcase</h2>
      <p className="font-body text-foreground/70">
        Hover over the elements below to see the magnetic + spring physics in action.
      </p>

      <div className="flex flex-wrap gap-6">
        <m.div
          ref={defaultHover.ref}
          style={defaultHover.style}
          {...defaultHover.handlers}
          className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-xl bg-accent-cyan/20 p-4 text-center"
        >
          <span className="font-body text-sm">Default</span>
        </m.div>

        <m.div
          ref={strongMagnet.ref}
          style={strongMagnet.style}
          {...strongMagnet.handlers}
          className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-xl bg-accent-violet/20 p-4 text-center"
        >
          <span className="font-body text-sm">Strong Magnet</span>
        </m.div>

        <m.div
          ref={subtleHover.ref}
          style={subtleHover.style}
          {...subtleHover.handlers}
          className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-xl bg-foreground/10 p-4 text-center"
        >
          <span className="font-body text-sm">Subtle</span>
        </m.div>
      </div>

      {defaultHover.isReducedMotion && (
        <p className="font-body text-accent-cyan text-sm">
          Reduced motion detected - showing opacity-only fallback
        </p>
      )}
    </div>
  );
};
