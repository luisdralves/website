export type Point = {
  id: number;
  baseX: number;
  baseY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  x: number;
  y: number;
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
