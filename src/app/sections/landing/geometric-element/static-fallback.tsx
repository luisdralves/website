"use client";

import { NEIGHBORS } from "./constants";
import { INITIAL_POINTS } from "./points";
import type { Point } from "./types";

export const StaticFallback = () => {
  const points = INITIAL_POINTS;
  const edges: Array<{ p1: Point; p2: Point }> = [];

  for (const point of points) {
    const distances = points
      .filter((p) => p.id !== point.id)
      .map((other) => ({
        other,
        dist: Math.sqrt((point.nx - other.nx) ** 2 + (point.ny - other.ny) ** 2),
      }))
      .sort((a, b) => a.dist - b.dist);

    for (let i = 0; i < Math.min(NEIGHBORS, distances.length); i++) {
      const other = distances[i].other;
      if (point.id < other.id) {
        edges.push({ p1: point, p2: other });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {edges.map(({ p1, p2 }) => (
        <line
          key={`${p1.id}-${p2.id}`}
          x1={p1.nx * 100}
          y1={p1.ny * 100}
          x2={p2.nx * 100}
          y2={p2.ny * 100}
          stroke={(p1.id + p2.id) % 2 === 0 ? "var(--accent-cyan)" : "var(--accent-violet)"}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          opacity={0.4}
        />
      ))}
      {points.map((point) => (
        <circle
          key={point.id}
          cx={point.nx * 100}
          cy={point.ny * 100}
          r={0.4}
          fill={point.id % 2 === 0 ? "var(--accent-cyan)" : "var(--accent-violet)"}
        />
      ))}
    </svg>
  );
};
