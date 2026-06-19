"use client";

import { AnimatePresence, animate, m, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SLIDE_IDLE = "-0.5em";
const SLIDE_TARGET = "-1.5em";
const WHEEL_MASK = "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)";

type DigitProps = { value: number };

const Digit = ({ value }: DigitProps) => {
  const y = useMotionValue(SLIDE_IDLE);
  const [renderedValue, setRenderedValue] = useState(value);
  const animatingRef = useRef(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (value === renderedValue || animatingRef.current) return;

    const delta = value - renderedValue;
    // delta === 1: normal increment; delta === -9: rollover from 9 to 0.
    const isSingleForwardStep = delta === 1 || delta === -9;

    if (!isSingleForwardStep || shouldReduce) {
      setRenderedValue(value);
      return;
    }

    animatingRef.current = true;
    animate(y, SLIDE_TARGET, {
      duration: 0.45,
      ease: [0.22, 0.61, 0.36, 1],
      onComplete: () => {
        y.set(SLIDE_IDLE);
        setRenderedValue(value);
        animatingRef.current = false;
      },
    });
  }, [value, renderedValue, y, shouldReduce]);

  const prev = (renderedValue + 9) % 10;
  const current = renderedValue;
  const next = (renderedValue + 1) % 10;
  const nextNext = (renderedValue + 2) % 10;

  return (
    <span
      className="relative inline-block h-[2em] w-[1ch] overflow-hidden align-middle"
      style={{ maskImage: WHEEL_MASK, WebkitMaskImage: WHEEL_MASK }}
    >
      <m.span style={{ y }} className="absolute inset-x-0 top-0 flex flex-col">
        <span className="block h-[1em] text-center leading-none">{prev}</span>
        <span className="block h-[1em] text-center leading-none">{current}</span>
        <span className="block h-[1em] text-center leading-none">{next}</span>
        <span className="block h-[1em] text-center leading-none">{nextNext}</span>
      </m.span>
    </span>
  );
};

type DigitDisplayProps = { value: number };

export const DigitDisplay = ({ value }: DigitDisplayProps) => {
  const digits = Math.max(0, Math.floor(value)).toString().split("").map(Number);

  return (
    <span className="inline-flex tabular-nums leading-none">
      <AnimatePresence mode="popLayout" initial={false}>
        {digits.map((digit, i) => {
          const positionFromRight = digits.length - 1 - i;
          return (
            <m.span
              key={`pos-${positionFromRight}`}
              layout
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ transformOrigin: "left center" }}
            >
              <Digit value={digit} />
            </m.span>
          );
        })}
      </AnimatePresence>
    </span>
  );
};
