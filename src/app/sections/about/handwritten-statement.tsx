"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef } from "react";
import { fetchFont, renderHandwriting } from "./render-handwriting";

type PathInfo = { el: SVGPathElement; length: number; cumStart: number };

type HandwrittenStatementProps = {
  text: string;
  fontUrl?: string;
};

const MAX_WIDTH_PX = 420;
const STROKE_WIDTH = 1.2;

export const HandwrittenStatement = ({
  text,
  fontUrl = "/fonts/shadows-into-light.json",
}: HandwrittenStatementProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<PathInfo[]>([]);
  const totalLengthRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "start 30%"],
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let renderedSvg: SVGSVGElement | null = null;

    (async () => {
      const font = await fetchFont(fontUrl);
      if (cancelled || !containerRef.current) return;

      const svg = renderHandwriting(containerRef.current, font, text, {
        fontSize: 28,
        strokeWidth: STROKE_WIDTH,
        color: "currentColor",
      });
      renderedSvg = svg;

      const bbox = svg.getBBox();
      const margin = STROKE_WIDTH / 2 + 1;
      const vbX = bbox.x - margin;
      const vbY = bbox.y - margin;
      const vbW = bbox.width + margin * 2;
      const vbH = bbox.height + margin * 2;

      svg.setAttribute("width", String(Math.ceil(vbW)));
      svg.setAttribute("height", String(Math.ceil(vbH)));
      svg.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
      svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
      svg.style.display = "block";
      svg.style.maxWidth = `${MAX_WIDTH_PX}px`;
      svg.style.height = "auto";

      const paths = Array.from(svg.querySelectorAll("path")) as SVGPathElement[];
      let cum = 0;
      const info: PathInfo[] = [];
      for (const path of paths) {
        path.style.opacity = "1";
        path.setAttribute("data-scroll-animated", "stroke-dashoffset:0");
        const length = path.getTotalLength();
        info.push({ el: path, length, cumStart: cum });
        cum += length;
      }
      pathsRef.current = info;
      totalLengthRef.current = cum;
    })();

    return () => {
      cancelled = true;
      renderedSvg?.remove();
      pathsRef.current = [];
      totalLengthRef.current = 0;
    };
  }, [text, fontUrl]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const total = totalLengthRef.current;
    if (total === 0) return;
    const inked = progress * total;
    for (const { el, length, cumStart } of pathsRef.current) {
      const drawn = Math.max(0, Math.min(length, inked - cumStart));
      el.style.strokeDashoffset = `${length + 1 - drawn}`;
    }
  });

  return <div ref={containerRef} className="flex justify-center text-accent-cyan" />;
};
