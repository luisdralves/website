"use client";

import { m } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { SectionId } from "@/hooks/use-active-section";

type Props = {
  targetSection: SectionId;
  origin: { x: number; y: number };
  onComplete: () => void;
};

export const RadialReveal = ({ targetSection, origin, onComplete }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [targetScrollY, setTargetScrollY] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useLayoutEffect(() => {
    const targetElement = document.getElementById(targetSection);
    const mainContent = document.querySelector("main");
    if (!targetElement || !mainContent || !overlayRef.current) return;

    // Clamp to max scrollable position for short sections that can't reach viewport top
    const targetTop = targetElement.offsetTop;
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const clampedScrollY = Math.min(targetTop, Math.max(0, maxScrollY));
    setTargetScrollY(clampedScrollY);

    const clone = mainContent.cloneNode(true) as HTMLElement;
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.width = "100%";
    clone.style.transform = `translateY(-${clampedScrollY}px)`;
    clone.style.pointerEvents = "none";

    // Reset scroll-animated elements to their initial visual state
    // Format: data-scroll-animated="property1:value1;property2:value2"
    clone.querySelectorAll("[data-scroll-animated]").forEach((el) => {
      const htmlEl = el as HTMLElement | SVGElement;
      const resetValues = htmlEl.dataset.scrollAnimated;
      if (resetValues) {
        resetValues.split(";").forEach((pair) => {
          const [property, value] = pair.split(":");
          if (property && value !== undefined) {
            htmlEl.style.setProperty(property, value);
          }
        });
      }
    });

    overlayRef.current.innerHTML = "";
    overlayRef.current.appendChild(clone);

    setIsReady(true);
  }, [targetSection]);

  // Continuously sync canvas content during the reveal animation
  useEffect(() => {
    if (!isReady || hasCompleted) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    // Cache canvas pairs once at effect start
    const allCanvases = document.querySelectorAll("canvas");
    const originalCanvases: HTMLCanvasElement[] = [];
    for (const canvas of allCanvases) {
      if (!overlay.contains(canvas)) {
        originalCanvases.push(canvas as HTMLCanvasElement);
      }
    }
    const clonedCanvases = Array.from(overlay.querySelectorAll("canvas")) as HTMLCanvasElement[];

    let animationId: number;

    const syncCanvases = () => {
      originalCanvases.forEach((original, index) => {
        const cloned = clonedCanvases[index];
        if (!cloned || original.width === 0 || original.height === 0) return;

        const clonedCtx = cloned.getContext("2d");
        if (!clonedCtx) return;

        if (cloned.width !== original.width) cloned.width = original.width;
        if (cloned.height !== original.height) cloned.height = original.height;

        clonedCtx.clearRect(0, 0, cloned.width, cloned.height);
        clonedCtx.drawImage(original, 0, 0);
      });

      animationId = requestAnimationFrame(syncCanvases);
    };

    animationId = requestAnimationFrame(syncCanvases);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isReady, hasCompleted]);

  const maxRadius =
    typeof window !== "undefined"
      ? Math.hypot(
          Math.max(origin.x, window.innerWidth - origin.x),
          Math.max(origin.y, window.innerHeight - origin.y),
        )
      : 2000;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleAnimationComplete = () => {
    if (hasCompleted) return;
    setHasCompleted(true);
    window.scrollTo({ top: targetScrollY, behavior: "instant" });
    requestAnimationFrame(() => onComplete());
  };

  const finalRadius = maxRadius * 1.1;
  const borderWidth = 2;

  return (
    <>
      <m.div
        className="fixed inset-0 z-98 bg-accent-cyan"
        initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
        animate={
          isReady
            ? { clipPath: `circle(${finalRadius + borderWidth}px at ${origin.x}px ${origin.y}px)` }
            : { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }
        }
        transition={{ duration: 1 }}
      />

      <m.div
        className="fixed inset-0 z-99 overflow-hidden"
        initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
        animate={
          isReady
            ? { clipPath: `circle(${finalRadius}px at ${origin.x}px ${origin.y}px)` }
            : { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }
        }
        transition={{ duration: 1 }}
        onAnimationComplete={handleAnimationComplete}
      >
        <div
          ref={overlayRef}
          className="relative h-screen w-full overflow-hidden bg-background"
          aria-hidden="true"
        />
      </m.div>
    </>
  );
};
