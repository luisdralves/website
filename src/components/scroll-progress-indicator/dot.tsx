"use client";

import { m, useReducedMotion } from "motion/react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { SECTION_LABELS, type SectionId } from "@/hooks/use-active-section";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";
import { springSnappy } from "@/lib/motion";

export const PROXIMITY_THRESHOLD = 60;

type Props = {
  sectionId: SectionId;
  isActive: boolean;
  cursorPosition: { x: number; y: number } | null;
  onDotClick: (sectionId: SectionId, event: ReactMouseEvent) => void;
};

export const Dot = ({ sectionId, isActive, cursorPosition, onDotClick }: Props) => {
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const labelRef = useRef<HTMLButtonElement | null>(null);

  const {
    ref: magneticRef,
    style: magneticStyle,
    handlers,
  } = useMagneticSpringHover<HTMLButtonElement>({
    magnetStrength: 0.3,
    scaleAmount: 1.3,
    shadowElevation: 6,
  });

  const [proximity, setProximity] = useState(0);

  useEffect(() => {
    if (!buttonRef.current || !cursorPosition) {
      setProximity(0);
      return;
    }

    const dotRect = buttonRef.current.getBoundingClientRect();
    const labelRect = labelRef.current?.getBoundingClientRect();

    let combinedRect: { left: number; right: number; top: number; bottom: number };

    if (labelRect && labelRect.width > 0) {
      combinedRect = {
        left: Math.min(dotRect.left, labelRect.left),
        right: Math.max(dotRect.right, labelRect.right),
        top: Math.min(dotRect.top, labelRect.top),
        bottom: Math.max(dotRect.bottom, labelRect.bottom),
      };
    } else {
      combinedRect = dotRect;
    }

    const dx = Math.max(
      combinedRect.left - cursorPosition.x,
      0,
      cursorPosition.x - combinedRect.right,
    );
    const dy = Math.max(
      combinedRect.top - cursorPosition.y,
      0,
      cursorPosition.y - combinedRect.bottom,
    );
    const distance = Math.hypot(dx, dy);
    const proximity = Math.max(0, 1 - distance / PROXIMITY_THRESHOLD);
    setProximity(proximity);
  }, [cursorPosition]);

  const showLabel = proximity > 0.1;

  return (
    <div className="relative flex items-center">
      <m.button
        ref={labelRef}
        type="button"
        onClick={(e) => onDotClick(sectionId, e)}
        className="absolute right-full mr-3 cursor-pointer whitespace-nowrap font-body text-foreground text-sm"
        initial={{ opacity: 0, x: 10 }}
        animate={{
          opacity: shouldReduceMotion ? (showLabel ? 1 : 0) : proximity,
          x: shouldReduceMotion ? 0 : (1 - proximity) * 10,
        }}
        transition={springSnappy}
      >
        {SECTION_LABELS[sectionId]}
      </m.button>

      <m.button
        ref={(el) => {
          buttonRef.current = el;
          magneticRef.current = el;
        }}
        type="button"
        aria-label={`Navigate to ${SECTION_LABELS[sectionId]} section`}
        aria-current={isActive ? "true" : undefined}
        className="relative flex h-6 w-6 cursor-pointer items-center justify-center"
        style={magneticStyle}
        onClick={(e) => onDotClick(sectionId, e)}
        {...handlers}
      >
        <m.span
          className={`block rounded-full ${isActive ? "bg-accent-cyan" : "bg-foreground/40"}`}
          animate={{ scale: isActive ? 1.4 : 1 }}
          transition={springSnappy}
          style={{
            width: 8,
            height: 8,
          }}
        />
      </m.button>
    </div>
  );
};
