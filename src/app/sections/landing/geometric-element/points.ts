import type { Point } from "./types";

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

export const generatePoints = (): Point[] => {
  const points: Point[] = [];
  const numPoints = 40;

  for (let i = 0; i < numPoints; i++) {
    const rand = (offset: number) => seededRandom(i * 100 + offset);
    const baseX = 50 + rand(1) * 900;
    const baseY = 30 + rand(2) * 440;

    points.push({
      id: i,
      baseX,
      baseY,
      driftPhaseX: rand(3) * Math.PI * 2,
      driftPhaseY: rand(4) * Math.PI * 2,
      driftSpeedX: 0.00015 + rand(5) * 0.00025,
      driftSpeedY: 0.00015 + rand(6) * 0.00025,
      x: baseX,
      y: baseY,
      velocityX: 0,
      velocityY: 0,
      targetOffsetX: 0,
      targetOffsetY: 0,
      currentOffsetX: 0,
      currentOffsetY: 0,
    });
  }

  return points;
};

export const INITIAL_POINTS = generatePoints();
