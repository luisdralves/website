"use client";

import { easeInOut, type MotionValue, m, useTransform } from "motion/react";
import { type Anchors, linear, phaseFor } from "./lifecycle";

type PlacardProps = {
  index: number;
  total: number;
  localProgress: MotionValue<number>;
  anchors: Anchors;
};

export const Placard = ({ index, total, localProgress, anchors }: PlacardProps) => {
  const { enterStart, enterEnd, exitStart, exitEnd } = phaseFor("placard", anchors);
  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const y = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [-12, 0, 0, 12],
    { ease: [easeInOut, linear, easeInOut] },
  );

  return (
    <m.div style={{ opacity, y }} className="flex items-center gap-3">
      <span className="font-mono text-[oklch(var(--project-accent))] text-xs tracking-widest">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </m.div>
  );
};
