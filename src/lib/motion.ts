/**
 * Shared spring configurations for consistent physics-based animations.
 *
 * Spring parameters:
 * - stiffness: Higher = more sudden movement
 * - damping: Opposing force; higher = less oscillation
 * - mass: Higher = more lethargic movement
 */

import type { Transition } from "motion/react";

/**
 * Snappy spring for micro-interactions (200-300ms feel).
 * Use for hover states, button clicks, toggles.
 */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 1,
};

/**
 * Gentle spring for section transitions (400-600ms feel).
 * Use for page transitions, modal appearances, content reveals.
 */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
};

/**
 * Bouncy spring for playful interactions.
 * Use for attention-grabbing elements, celebratory animations.
 */
export const springBouncy: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 10,
  mass: 1,
};
