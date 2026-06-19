"use client";

import { easeInOut, type MotionValue, m, useTransform } from "motion/react";
import { type Anchors, linear, phaseFor, stagger } from "./lifecycle";

type HookWordProps = {
  word: string;
  index: number;
  total: number;
  localProgress: MotionValue<number>;
  anchors: Anchors;
};

export const HookWord = ({ word, index, total, localProgress, anchors }: HookWordProps) => {
  const phase = stagger(phaseFor("hook", anchors), index, total, 0.55, true);
  const { enterStart, enterEnd, exitStart, exitEnd } = phase;

  const exitX = index % 2 === 0 ? -48 : 48;
  const exitY = index % 2 === 0 ? -56 : 44;
  const exitRotate = index % 2 === 0 ? -10 : 10;

  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const y = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [88, 0, 0, exitY],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const x = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 0, 0, exitX],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const rotate = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [4, 0, 0, exitRotate],
    { ease: [easeInOut, linear, easeInOut] },
  );

  return (
    <m.span style={{ opacity, x, y, rotate }} className="inline-block">
      {word}
    </m.span>
  );
};
