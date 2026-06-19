"use client";

import { backOut, easeInOut, type MotionValue, m, useTransform } from "motion/react";
import { type Anchors, linear, phaseFor, stagger } from "./lifecycle";
import { TechKey } from "./tech-key";

type TechKeyDeckProps = {
  techStack: readonly string[];
  localProgress: MotionValue<number>;
  anchors: Anchors;
};

type TechKeyWrapperProps = {
  techKey: string;
  index: number;
  total: number;
  localProgress: MotionValue<number>;
  anchors: Anchors;
};

const TechKeyWrapper = ({ techKey, index, total, localProgress, anchors }: TechKeyWrapperProps) => {
  const phase = stagger(phaseFor("techKeys", anchors), index, total, 0.6, true);
  const { enterStart, enterEnd, exitStart, exitEnd } = phase;

  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const y = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [-140, 0, 0, 140],
    { ease: [backOut, linear, easeInOut] },
  );
  const rotate = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [index % 2 === 0 ? -18 : 18, 0, 0, index % 2 === 0 ? -32 : 32],
    { ease: [backOut, linear, easeInOut] },
  );

  return (
    <m.div style={{ opacity, y, rotate }} className="inline-block">
      <TechKey techKey={techKey} />
    </m.div>
  );
};

export const TechKeyDeck = ({ techStack, localProgress, anchors }: TechKeyDeckProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {techStack.map((tech, i) => (
        <TechKeyWrapper
          key={tech}
          techKey={tech}
          index={i}
          total={techStack.length}
          localProgress={localProgress}
          anchors={anchors}
        />
      ))}
    </div>
  );
};
