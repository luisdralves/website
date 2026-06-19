"use client";

import { easeInOut, type MotionValue, m, useTransform } from "motion/react";
import { type Anchors, linear, phaseFor } from "./lifecycle";

type DescriptionRevealProps = {
  text: string;
  localProgress: MotionValue<number>;
  anchors: Anchors;
};

export const DescriptionReveal = ({ text, localProgress, anchors }: DescriptionRevealProps) => {
  const { enterStart, enterEnd, exitStart, exitEnd } = phaseFor("description", anchors);
  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const y = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [28, 0, 0, -16],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const filter = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(8px)"],
    { ease: [easeInOut, linear, easeInOut] },
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
