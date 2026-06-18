"use client";

import { type MotionValue, m, useTransform } from "motion/react";
import { PHASES } from "./lifecycle";

type DescriptionRevealProps = {
  text: string;
  localProgress: MotionValue<number>;
};

export const DescriptionReveal = ({ text, localProgress }: DescriptionRevealProps) => {
  const { enterStart, enterEnd, exitStart, exitEnd } = PHASES.description;
  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [28, 0, 0, -16],
  );
  const filter = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(8px)"],
  );

  return (
    <m.p
      style={{ opacity, y, filter }}
      className="max-w-xl font-body desktop:text-lg text-base text-foreground/70 leading-relaxed"
    >
      {text}
    </m.p>
  );
};
