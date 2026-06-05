"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { RadialReveal } from "@/components/scroll-progress-indicator/radial-reveal";
import { SECTION_IDS, type SectionId, useActiveSection } from "@/hooks/use-active-section";
import { Dot, PROXIMITY_THRESHOLD } from "./dot";

export const ScrollProgressIndicator = () => {
  const activeSection = useActiveSection();
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const [transition, setTransition] = useState<{
    targetSection: SectionId;
    origin: { x: number; y: number };
  } | null>(null);

  const displayedActiveSection = transition?.targetSection ?? activeSection;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const extendedThreshold = PROXIMITY_THRESHOLD * 2;
      const isNearContainer =
        e.clientX >= rect.left - extendedThreshold &&
        e.clientX <= rect.right + extendedThreshold &&
        e.clientY >= rect.top - extendedThreshold &&
        e.clientY <= rect.bottom + extendedThreshold;

      if (isNearContainer) {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      } else {
        setCursorPosition(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <nav
        ref={containerRef}
        aria-label="Page sections"
        className="-translate-y-1/2 fixed top-1/2 right-4 z-100 hidden flex-col gap-3 md:flex"
      >
        {SECTION_IDS.map((sectionId) => (
          <Dot
            key={sectionId}
            sectionId={sectionId}
            isActive={displayedActiveSection === sectionId}
            cursorPosition={cursorPosition}
            onDotClick={(sectionId, event) => {
              if (shouldReduceMotion) {
                const targetElement = document.getElementById(sectionId);
                if (targetElement) {
                  window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "instant",
                  });
                  history.replaceState(null, "", `#${sectionId}`);
                }
                return;
              }

              setTransition({
                targetSection: sectionId,
                origin: { x: event.clientX, y: event.clientY },
              });
            }}
          />
        ))}
      </nav>

      {transition && (
        <RadialReveal
          targetSection={transition.targetSection}
          origin={transition.origin}
          onComplete={() => setTransition(null)}
        />
      )}
    </>
  );
};
