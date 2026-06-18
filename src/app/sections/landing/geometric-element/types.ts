export type Point = {
  id: number;
  /** Normalized base position [0, 1] — multiplied by canvas dimensions at frame time. */
  nx: number;
  ny: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  /** Current position in canvas-relative pixels. */
  x: number;
  y: number;
  /** Physics state, all in canvas pixels / pixels-per-second. */
  velocityX: number;
  velocityY: number;
  targetOffsetX: number;
  targetOffsetY: number;
  currentOffsetX: number;
  currentOffsetY: number;
};

export enum EdgePhase {
  Appearing = 0,
  Visible = 1,
  Disappearing = 2,
}

export type EdgeState = {
  id1: number;
  id2: number;
  phase: EdgePhase;
  progress: number;
};

export type Color = { r: number; g: number; b: number };
