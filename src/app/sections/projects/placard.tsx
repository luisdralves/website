"use client";

import { type MotionValue, m, useTransform } from "motion/react";
import { PHASES } from "./lifecycle";

type PlacardProps = {
  index: number;
  total: number;
  localProgress: MotionValue<number>;
};

export const Placard = ({ index, total, localProgress }: PlacardProps) => {
  const { enterStart, enterEnd, exitStart, exitEnd } = PHASES.placard;
  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [-12, 0, 0, 12],
  );

  return (
    <m.div style={{ opacity, y }} className="flex items-center gap-3">
      <span className="font-mono text-[oklch(var(--project-accent))] text-xs tracking-widest">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </m.div>
  );
};
