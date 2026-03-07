"use client";

import { useInView } from "motion/react";
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { initialState, reducer } from "./reducer";
import type { KeySequence } from "./sequence";
import styles from "./styles.module.css";

const HANDLED_KEYS = [
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "Enter",
  "PageUp",
  "PageDown",
];

type DynamicTypewriterProps = {
  sequence: KeySequence;
};

export const DynamicTypewriter = ({ sequence }: DynamicTypewriterProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 1 });

  const [state, dispatch] = useReducer(reducer, initialState);
  const [autoTick, setAutoTick] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const sequenceIndex = useRef(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional restart on iter change
  useLayoutEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = "";
  }, [state.iter]);

  useEffect(() => {
    if (!isInView) return;

    if (!hasStarted) setHasStarted(true);

    const currentIndex = sequenceIndex.current;
    const currentKey = sequence.keys[currentIndex];
    const delay = sequence.delays[currentIndex];

    const timeout = setTimeout(() => {
      dispatch({ type: "KEY", key: currentKey });

      sequenceIndex.current = currentIndex + 1;
      if (sequenceIndex.current >= sequence.keys.length) {
        sequenceIndex.current = sequence.loopStart;
      }

      setAutoTick(autoTick + 1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, sequence, autoTick, hasStarted]);

  useEffect(() => {
    if (!isInView) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (HANDLED_KEYS.includes(e.key) || e.key.length === 1) {
        e.preventDefault();
        dispatch({ type: "KEY", key: e.key });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInView]);

  return (
    <p
      ref={ref}
      className="min-h-[2.5em] whitespace-pre-wrap font-mono text-2xl leading-[1.2] md:text-3xl"
    >
      {state.text.slice(0, state.cursor)}
      {hasStarted && (
        <span className="relative">
          <span
            ref={cursorRef}
            className={`-top-0.5 absolute bottom-0.5 left-0 w-[0.6em] bg-foreground mix-blend-difference ${styles.cursor}`}
          />
        </span>
      )}
      {state.text.slice(state.cursor)}
    </p>
  );
};
