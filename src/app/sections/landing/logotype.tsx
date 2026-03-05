"use client";

import { type MotionValue, m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { springGentle } from "@/lib/motion";

const STROKE_WIDTH = 0.05;

const LogotypePath = ({
  d,
  scrollProgress,
}: {
  d: string;
  scrollProgress: MotionValue<number>;
}) => {
  const strokeDashoffset = useTransform(scrollProgress, [0, 0.5], [0, 1]);

  return (
    <m.path
      d={d}
      pathLength={1}
      strokeDasharray={1}
      initial={{ strokeDashoffset: 1, opacity: 0 }}
      animate={{ strokeDashoffset: 0, opacity: 1 }}
      style={{ strokeDashoffset }}
      transition={springGentle}
      data-scroll-animated="stroke-dashoffset:0"
    />
  );
};

type Props = {
  paths: { d: string; key: string }[];
};

export const Logotype = ({ paths }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <div ref={ref} className="flex min-h-screen w-full items-center justify-center">
      <m.svg
        role="img"
        aria-label="luisdralves"
        viewBox="-0.5 -0.5 49 11"
        className="w-[90vw] max-w-6xl text-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        {paths.map(({ d, key }) => (
          <LogotypePath key={key} d={d} scrollProgress={scrollYProgress} />
        ))}
      </m.svg>
    </div>
  );
};
