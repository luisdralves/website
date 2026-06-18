import type { Color } from "./types";

/** Drift radius as a fraction of the canvas's smaller dimension. */
export const DRIFT_RATIO = 0.05;
export const NEIGHBORS = 3;
/** Cursor reach, in screen pixels. */
export const PROXIMITY_THRESHOLD = 250;
/** Maximum cursor-repulsion offset, in canvas pixels. */
export const REPEL_STRENGTH = 60;
export const SPRING_STIFFNESS = 180;
export const SPRING_DAMPING = 12;
export const SPRING_MASS = 1;
export const EDGE_APPEAR_SPEED = 4;
export const EDGE_DISAPPEAR_SPEED = 5;
/** Edge opacity fade distance, as a fraction of the canvas's smaller dimension. */
export const EDGE_FADE_RATIO = 0.4;
export const CYAN: Color = { r: 68, g: 211, b: 220 };
export const VIOLET: Color = { r: 145, g: 82, b: 211 };
export const BLUE: Color = { r: 107, g: 147, b: 216 };
