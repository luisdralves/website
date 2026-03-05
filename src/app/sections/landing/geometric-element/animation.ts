import {
  BLUE,
  CYAN,
  DRIFT_AMOUNT,
  EDGE_APPEAR_SPEED,
  EDGE_DISAPPEAR_SPEED,
  NEIGHBORS,
  PROXIMITY_THRESHOLD,
  REPEL_STRENGTH,
  SPRING_DAMPING,
  SPRING_MASS,
  SPRING_STIFFNESS,
  VIOLET,
} from "./constants";
import { type Color, EdgePhase, type EdgeState, type Point } from "./types";

type Cursor = { x: number; y: number };

export const updatePoints = (
  points: Point[],
  elapsed: number,
  deltaTime: number,
  cursor: Cursor,
  rect: DOMRect,
  scaleX: number,
  scaleY: number,
  isTouchDevice: boolean,
) => {
  for (const point of points) {
    const driftX = Math.sin(elapsed * point.driftSpeedX + point.driftPhaseX) * DRIFT_AMOUNT;
    const driftY = Math.sin(elapsed * point.driftSpeedY + point.driftPhaseY) * DRIFT_AMOUNT;

    point.targetOffsetX = 0;
    point.targetOffsetY = 0;

    if (!isTouchDevice && cursor.x !== 0) {
      const pointScreenX = rect.left + (point.baseX + driftX) * scaleX;
      const pointScreenY = rect.top + (point.baseY + driftY) * scaleY;
      const dx = cursor.x - pointScreenX;
      const dy = cursor.y - pointScreenY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < PROXIMITY_THRESHOLD && distance > 0) {
        const influence = (1 - distance / PROXIMITY_THRESHOLD) ** 2;
        point.targetOffsetX = -(dx / distance) * influence * REPEL_STRENGTH;
        point.targetOffsetY = -(dy / distance) * influence * REPEL_STRENGTH;
      }
    }

    const forceX = (point.targetOffsetX - point.currentOffsetX) * SPRING_STIFFNESS;
    const forceY = (point.targetOffsetY - point.currentOffsetY) * SPRING_STIFFNESS;
    const dampingX = point.velocityX * SPRING_DAMPING;
    const dampingY = point.velocityY * SPRING_DAMPING;

    point.velocityX += ((forceX - dampingX) / SPRING_MASS) * deltaTime;
    point.velocityY += ((forceY - dampingY) / SPRING_MASS) * deltaTime;
    point.currentOffsetX += point.velocityX * deltaTime;
    point.currentOffsetY += point.velocityY * deltaTime;

    point.x = point.baseX + driftX + point.currentOffsetX;
    point.y = point.baseY + driftY + point.currentOffsetY;
  }
};

export const findCurrentEdges = (points: Point[]): Set<string> => {
  const currentEdges = new Set<string>();

  for (const point of points) {
    const distances = points
      .filter((p) => p.id !== point.id)
      .map((other) => ({
        other,
        dist: Math.sqrt((point.x - other.x) ** 2 + (point.y - other.y) ** 2),
      }))
      .sort((a, b) => a.dist - b.dist);

    for (let i = 0; i < Math.min(NEIGHBORS, distances.length); i++) {
      const other = distances[i].other;
      const edgeKey = point.id < other.id ? `${point.id}-${other.id}` : `${other.id}-${point.id}`;
      currentEdges.add(edgeKey);
    }
  }

  return currentEdges;
};

export const updateEdges = (
  edges: Map<string, EdgeState>,
  currentEdges: Set<string>,
  deltaTime: number,
) => {
  // Mark edges that should disappear
  for (const [key, edge] of edges) {
    if (!currentEdges.has(key) && edge.phase !== EdgePhase.Disappearing) {
      edge.phase = EdgePhase.Disappearing;
      edge.progress = 0;
    }
  }

  // Add new edges or resurrect disappearing ones
  for (const key of currentEdges) {
    const existing = edges.get(key);
    if (!existing) {
      const [id1, id2] = key.split("-").map(Number);
      edges.set(key, { id1, id2, phase: EdgePhase.Appearing, progress: 0 });
    } else if (existing.phase === EdgePhase.Disappearing) {
      existing.phase = EdgePhase.Appearing;
      existing.progress = 1 - existing.progress;
    }
  }

  // Animate edges and remove fully disappeared ones
  const toRemove: string[] = [];
  for (const [key, edge] of edges) {
    if (edge.phase === EdgePhase.Appearing) {
      edge.progress += EDGE_APPEAR_SPEED * deltaTime;
      if (edge.progress >= 1) {
        edge.progress = 1;
        edge.phase = EdgePhase.Visible;
      }
    } else if (edge.phase === EdgePhase.Disappearing) {
      edge.progress += EDGE_DISAPPEAR_SPEED * deltaTime;
      if (edge.progress >= 1) {
        toRemove.push(key);
      }
    }
  }
  for (const key of toRemove) {
    edges.delete(key);
  }
};

const getEdgeColor = (id1: number, id2: number): Color => {
  const colorIndex = (id1 + id2) % 3;
  return colorIndex === 0 ? CYAN : colorIndex === 1 ? VIOLET : BLUE;
};

const drawLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: Color,
  opacity: number,
) => {
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

export const drawEdges = (
  ctx: CanvasRenderingContext2D,
  edges: Map<string, EdgeState>,
  points: Point[],
  scaleX: number,
  scaleY: number,
) => {
  ctx.lineWidth = 1;

  for (const [, edge] of edges) {
    const p1 = points[edge.id1];
    const p2 = points[edge.id2];

    const x1 = p1.x * scaleX;
    const y1 = p1.y * scaleY;
    const x2 = p2.x * scaleX;
    const y2 = p2.y * scaleY;

    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    const maxDist = 200;
    const baseOpacity = Math.max(0, 1 - dist / maxDist) * 0.6;
    const color = getEdgeColor(edge.id1, edge.id2);

    if (edge.phase === EdgePhase.Appearing) {
      const t = edge.progress;

      // First half: draw from p1 towards center
      const seg1End = Math.min(t * 2, 1);
      drawLine(ctx, x1, y1, x1 + (cx - x1) * seg1End, y1 + (cy - y1) * seg1End, color, baseOpacity);

      // Second half: draw from p2 towards center
      if (t > 0.5) {
        const seg2End = (t - 0.5) * 2;
        drawLine(
          ctx,
          x2,
          y2,
          x2 + (cx - x2) * (1 - seg2End),
          y2 + (cy - y2) * (1 - seg2End),
          color,
          baseOpacity,
        );
      }
    } else if (edge.phase === EdgePhase.Disappearing) {
      const t = edge.progress;
      const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const dirX = len > 0 ? (x2 - x1) / len : 0;
      const dirY = len > 0 ? (y2 - y1) / len : 0;

      if (t < 0.5) {
        // First half: gap grows from center
        const gapSize = t * 2;
        const halfLen = Math.sqrt((cx - x1) ** 2 + (cy - y1) ** 2);
        const gapHalf = halfLen * gapSize;

        drawLine(ctx, x1, y1, cx - dirX * gapHalf, cy - dirY * gapHalf, color, baseOpacity);
        drawLine(ctx, cx + dirX * gapHalf, cy + dirY * gapHalf, x2, y2, color, baseOpacity);
      } else {
        // Second half: segments shrink and fade
        const shrink = (t - 0.5) * 2;
        const fadeOpacity = baseOpacity * (1 - shrink);

        drawLine(
          ctx,
          x1,
          y1,
          x1 + (cx - x1) * (1 - shrink),
          y1 + (cy - y1) * (1 - shrink),
          color,
          fadeOpacity,
        );
        drawLine(
          ctx,
          x2 + (cx - x2) * (1 - shrink),
          y2 + (cy - y2) * (1 - shrink),
          x2,
          y2,
          color,
          fadeOpacity,
        );
      }
    } else {
      // Visible - draw full line
      drawLine(ctx, x1, y1, x2, y2, color, baseOpacity);
    }
  }
};

export const drawPoints = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  scaleX: number,
  scaleY: number,
) => {
  for (const point of points) {
    const x = point.x * scaleX;
    const y = point.y * scaleY;
    const color = point.id % 2 === 0 ? CYAN : VIOLET;
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
};
