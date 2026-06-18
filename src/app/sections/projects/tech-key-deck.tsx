"use client";

import { backOut, easeIn, easeOut, type MotionValue, m, useTransform } from "motion/react";
import { linear, PHASES, stagger } from "./lifecycle";
import { TechKey } from "./tech-key";

type TechKeyDeckProps = {
  techStack: readonly string[];
  localProgress: MotionValue<number>;
};

type TechKeyWrapperProps = {
  techKey: string;
  index: number;
  total: number;
  localProgress: MotionValue<number>;
};

const TechKeyWrapper = ({ techKey, index, total, localProgress }: TechKeyWrapperProps) => {
  const phase = stagger(PHASES.techKeys, index, total, 0.6, true);
  const { enterStart, enterEnd, exitStart, exitEnd } = phase;

  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeOut, linear, easeIn] },
  );
  const y = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [-140, 0, 0, 140],
    { ease: [backOut, linear, easeIn] },
  );
  const rotate = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [index % 2 === 0 ? -18 : 18, 0, 0, index % 2 === 0 ? -32 : 32],
    { ease: [backOut, linear, easeIn] },
  );

  return (
    <m.div style={{ opacity, y, rotate }} className="inline-block">
      <TechKey techKey={techKey} />
    </m.div>
  );
};

export const TechKeyDeck = ({ techStack, localProgress }: TechKeyDeckProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {techStack.map((tech, i) => (
        <TechKeyWrapper
          key={tech}
          techKey={tech}
          index={i}
          total={techStack.length}
          localProgress={localProgress}
        />
      ))}
    </div>
  );
};
