"use client";

import { easeIn, easeOut, type MotionValue, m, useTransform } from "motion/react";
import { linear, PHASES, stagger } from "./lifecycle";

type HookWordProps = {
  word: string;
  index: number;
  total: number;
  localProgress: MotionValue<number>;
};

export const HookWord = ({ word, index, total, localProgress }: HookWordProps) => {
  const phase = stagger(PHASES.hook, index, total, 0.55, true);
  const { enterStart, enterEnd, exitStart, exitEnd } = phase;

  const exitX = index % 2 === 0 ? -48 : 48;
  const exitY = index % 2 === 0 ? -56 : 44;
  const exitRotate = index % 2 === 0 ? -10 : 10;

  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeOut, linear, easeIn] },
  );
  const y = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [88, 0, 0, exitY],
    { ease: [easeOut, linear, easeIn] },
  );
  const x = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 0, 0, exitX],
    { ease: [easeOut, linear, easeIn] },
  );
  const rotate = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [4, 0, 0, exitRotate],
    { ease: [easeOut, linear, easeIn] },
  );

  return (
    <m.span style={{ opacity, x, y, rotate }} className="inline-block">
      {word}
    </m.span>
  );
};
