"use client";

import { useEffect, useRef, useState } from "react";
import { drawEdges, drawPoints, findCurrentEdges, updateEdges, updatePoints } from "./animation";
import { INITIAL_POINTS } from "./points";
import type { EdgeState, Point } from "./types";

export const DynamicCanvas = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Point[]>(INITIAL_POINTS.map((p) => ({ ...p })));
  const edgesRef = useRef<Map<string, EdgeState>>(new Map());
  const cursorRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouchDevice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const startTime = performance.now();
    lastTimeRef.current = startTime;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const points = pointsRef.current;
      const edges = edgesRef.current;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      const minDim = Math.min(rect.width, rect.height);

      updatePoints(points, elapsed, deltaTime, cursorRef.current, rect, isTouchDevice);

      const currentEdges = findCurrentEdges(points);
      updateEdges(edges, currentEdges, deltaTime);

      ctx.clearRect(0, 0, rect.width, rect.height);
      drawEdges(ctx, edges, points, minDim);
      drawPoints(ctx, points);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isTouchDevice]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};
