"use client";

import { m, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

type ThresholdProps = {
  children: ReactNode;
};

/**
 * Wraps the about content. As the section approaches the viewport, the content is
 * revealed from the centerline outward via clip-path, with two accent edges
 * marking the parting line. Uses clip-path (not opaque overlays) so it doesn't
 * cover the particles rendered behind the section.
 */
export const Threshold = ({ children }: ThresholdProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 50% 0 50%)", "inset(0 0% 0 0%)"],
  );
  const leftEdge = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
  const rightEdge = useTransform(scrollYProgress, [0, 1], ["50%", "100%"]);
  const edgeOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative">
      <m.div style={{ clipPath }} data-scroll-animated="clip-path:inset(0 0% 0 0%)">
        {children}
      </m.div>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <m.div
          style={{ left: leftEdge, opacity: edgeOpacity }}
          data-scroll-animated="left:0%;opacity:0"
          className="absolute inset-y-0 w-px bg-accent-cyan shadow-[0_0_12px_oklch(0.75_0.14_195_/_0.6)]"
        />
        <m.div
          style={{ left: rightEdge, opacity: edgeOpacity }}
          data-scroll-animated="left:100%;opacity:0"
          className="absolute inset-y-0 w-px bg-accent-cyan shadow-[0_0_12px_oklch(0.75_0.14_195_/_0.6)]"
        />
      </div>
    </div>
  );
};
