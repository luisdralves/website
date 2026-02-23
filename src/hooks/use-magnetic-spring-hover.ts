/**
 * Combined magnetic + spring hover hook.
 *
 * Creates a physics-based hover effect where elements:
 * - Drift toward the cursor (magnetic attraction)
 * - Scale up with spring physics
 * - Lift with shadow elevation
 *
 * Gracefully degrades on touch devices (scale only, no magnetic).
 * Respects prefers-reduced-motion (opacity only).
 */

import type { MotionStyle, SpringOptions } from "motion/react";
import { useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MouseEvent, RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { springSnappy } from "@/lib/motion";

export type UseMagneticSpringHoverOptions = {
  /** Strength of magnetic attraction (0-1, default 0.3) */
  magnetStrength?: number;
  /** Scale multiplier on hover (default 1.05) */
  scaleAmount?: number;
  /** Shadow elevation on hover in px (default 8) */
  shadowElevation?: number;
  /** Spring configuration (default: springSnappy from lib/motion) */
  springConfig?: SpringOptions;
};

export type UseMagneticSpringHoverReturn<T extends HTMLElement> = {
  /** Ref to attach to the element */
  ref: RefObject<T | null>;
  /** Style object to spread onto motion component */
  style: MotionStyle;
  /** Event handlers to spread onto component */
  handlers: {
    onMouseMove: (e: MouseEvent) => void;
    onMouseLeave: () => void;
    onMouseEnter: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
  };
  /** Whether reduced motion is active */
  isReducedMotion: boolean;
};

/**
 * Hook for magnetic + spring hover effects.
 *
 * @example
 * ```tsx
 * const { ref, style, handlers } = useMagneticSpringHover()
 *
 * return (
 *   <m.button ref={ref} style={style} {...handlers}>
 *     Hover me
 *   </m.button>
 * )
 * ```
 */
export const useMagneticSpringHover = <T extends HTMLElement = HTMLDivElement>(
  options: UseMagneticSpringHoverOptions = {},
): UseMagneticSpringHoverReturn<T> => {
  const {
    magnetStrength = 0.3,
    scaleAmount = 1.05,
    shadowElevation = 8,
    springConfig = springSnappy,
  } = options;

  const ref = useRef<T | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // Motion values for cursor offset
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Hover progress for scale and shadow (0 = not hovered, 1 = fully hovered)
  const hoverProgress = useMotionValue(0);

  // Apply spring physics to position
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Apply spring physics to hover progress
  const springHoverProgress = useSpring(hoverProgress, springConfig);

  // Derive scale from hover progress
  const scale = useTransform(springHoverProgress, [0, 1], [1, scaleAmount]);

  // Derive shadow values from hover progress
  const shadowY = useTransform(springHoverProgress, [0, 1], [2, shadowElevation]);
  const shadowBlur = useTransform(springHoverProgress, [0, 1], [4, shadowElevation * 2]);
  const shadowOpacity = useTransform(springHoverProgress, [0, 1], [0.1, 0.2]);

  // Compose shadow string from individual values (OKLCH color space)
  const boxShadow = useTransform(
    [shadowY, shadowBlur, shadowOpacity],
    ([y, blur, alpha]) => `0 ${y}px ${blur}px oklch(0 0 0 / ${alpha})`,
  );

  // Derive opacity for reduced motion fallback
  const opacity = useTransform(springHoverProgress, [0, 1], [0.9, 1]);

  // Mouse move handler - track cursor offset from element center
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || isTouchDevice || shouldReduceMotion) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center, scaled by magnetic strength
      const offsetX = (e.clientX - centerX) * magnetStrength;
      const offsetY = (e.clientY - centerY) * magnetStrength;

      x.set(offsetX);
      y.set(offsetY);
    },
    [isTouchDevice, shouldReduceMotion, magnetStrength, x, y],
  );

  // Mouse enter handler - set hover state
  const onMouseEnter = useCallback(() => {
    hoverProgress.set(1);
  }, [hoverProgress]);

  // Mouse leave handler - reset position and hover state
  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    hoverProgress.set(0);
  }, [x, y, hoverProgress]);

  // Touch handlers for touch devices
  const onTouchStart = useCallback(() => {
    hoverProgress.set(1);
  }, [hoverProgress]);

  const onTouchEnd = useCallback(() => {
    hoverProgress.set(0);
  }, [hoverProgress]);

  // Build style object based on motion preference
  const style: MotionStyle = shouldReduceMotion
    ? {
        // Reduced motion: only opacity change
        opacity,
      }
    : {
        // Full motion: magnetic drift + scale + shadow
        x: isTouchDevice ? 0 : springX,
        y: isTouchDevice ? 0 : springY,
        scale,
        boxShadow,
      };

  return {
    ref,
    style,
    handlers: {
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
    },
    isReducedMotion: shouldReduceMotion ?? false,
  };
};
