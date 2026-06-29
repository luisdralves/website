"use client";

import { useScroll } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import type { Project } from "@/content/projects";
import { DescriptionBackdrop, type DescriptionBand } from "./description-backdrop";
import { type Anchors, anchorsFor, peakProgressFor } from "./lifecycle";
import { ProjectLayer } from "./project-layer";

// All values are in viewports (1.0 = 100svh). Dimensionless ratios.
const BASE = 0.95;
const EXTRA = 0.6;
const OVERLAP = 0.2;
const PRE_BUFFER = 1.5;
const POST_BUFFER = 1.5;

type ProjectsStageProps = {
  projects: readonly Project[];
};

type LayerRange = {
  inputRange: number[];
  outputRange: number[];
};

type Snap = {
  topVh: number;
  label: string;
};

type Layout = {
  layers: LayerRange[];
  anchors: Anchors[];
  sectionVh: number;
  snaps: Snap[];
  bands: DescriptionBand[];
  totalVh: number;
};

/**
 * Invert a layer's piecewise-linear local-progress map back to a widened coordinate (in viewports).
 * Mid projects use a single linear segment; first/last projects have a knot at
 * (preBuffer, pFirst) / (totalWidened - postBuffer, pLast).
 */
const localToWidened = (
  local: number,
  rawStart: number,
  rawEnd: number,
  knot: { atProgress: number; atLocal: number } | null,
): number => {
  if (!knot) {
    return rawStart + local * (rawEnd - rawStart);
  }
  if (local <= knot.atLocal) {
    const t = knot.atLocal === 0 ? 0 : local / knot.atLocal;
    return rawStart + t * (knot.atProgress - rawStart);
  }
  const t = (local - knot.atLocal) / (1 - knot.atLocal);
  return knot.atProgress + t * (rawEnd - knot.atProgress);
};

const computeLayout = (projects: readonly Project[]): Layout => {
  const lastIndex = projects.length - 1;

  const anchors = projects.map((p) => anchorsFor(p.media.length, BASE, EXTRA));

  const weights = projects.map((p, i) => {
    let w = BASE + (p.media.length - 1) * EXTRA;
    if (i === 0) w += PRE_BUFFER;
    if (i === lastIndex) w += POST_BUFFER;
    return w;
  });

  const rawRanges: { start: number; end: number }[] = [];
  let cursor = 0;
  for (let i = 0; i < weights.length; i++) {
    if (i > 0) cursor -= OVERLAP;
    rawRanges.push({ start: cursor, end: cursor + weights[i] });
    cursor += weights[i];
  }

  const totalWidened = cursor;
  // sticky-engaged section height = totalWidened - 1 viewport (the section, when pinned,
  // occupies one viewport, and scrolls the remaining "widened" budget).
  const sectionVh = Math.max(0, totalWidened - 1);
  const stickyEngage = PRE_BUFFER;
  const stickyDisengage = totalWidened - POST_BUFFER;
  const stickyEngageProgress = stickyEngage / totalWidened;
  const stickyDisengageProgress = stickyDisengage / totalWidened;

  const layers: LayerRange[] = rawRanges.map((r, i) => {
    const startProgress = r.start / totalWidened;
    const endProgress = r.end / totalWidened;

    if (i === 0) {
      return {
        inputRange: [startProgress, stickyEngageProgress, endProgress],
        outputRange: [0, anchors[0].pFirst, 1],
      };
    }
    if (i === lastIndex) {
      return {
        inputRange: [startProgress, stickyDisengageProgress, endProgress],
        outputRange: [0, anchors[lastIndex].pLast, 1],
      };
    }
    return {
      inputRange: [startProgress, endProgress],
      outputRange: [0, 1],
    };
  });

  const snaps: Snap[] = [];
  rawRanges.forEach((r, i) => {
    const project = projects[i];
    const slideCount = Math.max(1, project.media.length);
    const projectAnchors = anchors[i];
    const knot =
      i === 0
        ? { atProgress: stickyEngage, atLocal: projectAnchors.pFirst }
        : i === lastIndex
          ? { atProgress: stickyDisengage, atLocal: projectAnchors.pLast }
          : null;

    for (let j = 0; j < slideCount; j++) {
      const peakLocal = peakProgressFor(j, slideCount, projectAnchors);
      const widened = localToWidened(peakLocal, r.start, r.end, knot);
      const topVh = Math.max(0, Math.min(sectionVh, widened - 0.5));
      snaps.push({
        topVh,
        label: slideCount > 1 ? `${project.name} · slide ${j + 1}/${slideCount}` : project.name,
      });
    }
  });

  // Band boundaries sit at the midpoint of each adjacent pair's scroll overlap, so each project
  // owns the contiguous scroll span where it is the featured layer, and adjacent bands share an edge.
  const boundaries = [0];
  for (let i = 1; i < rawRanges.length; i++) {
    boundaries.push((rawRanges[i - 1].end + rawRanges[i].start) / 2);
  }
  boundaries.push(totalWidened);

  const bands: DescriptionBand[] = projects.map((p, i) => ({
    description: p.description,
    accent: p.accent,
    heightVh: (boundaries[i + 1] - boundaries[i]) * 100,
  }));

  return { layers, anchors, sectionVh, snaps, bands, totalVh: totalWidened * 100 };
};

export const ProjectsStage = ({ projects }: ProjectsStageProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const state = { topPassed: false, bottomActive: false };
    const sync = () => {
      document.documentElement.classList.toggle(
        "snap-active",
        state.topPassed && state.bottomActive,
      );
    };

    const topObserver = new IntersectionObserver(
      ([entry]) => {
        state.topPassed = entry.isIntersecting;
        sync();
      },
      { rootMargin: "0px 0px -100% 0px" },
    );

    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        state.bottomActive = entry.isIntersecting;
        sync();
      },
      { rootMargin: "-100% 0px 0px 0px" },
    );

    topObserver.observe(el);
    bottomObserver.observe(el);

    return () => {
      topObserver.disconnect();
      bottomObserver.disconnect();
      document.documentElement.classList.remove("snap-active");
    };
  }, []);

  const { layers, anchors, sectionVh, snaps, bands, totalVh } = useMemo(
    () => computeLayout(projects),
    [projects],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${sectionVh * 100}svh` }}
      data-projects-stage
    >
      <DescriptionBackdrop bands={bands} totalVh={totalVh} />
      {snaps.map((snap, i) => (
        <div
          key={`snap-${i}-${snap.label}`}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${snap.topVh * 100}svh`, scrollSnapAlign: "center" }}
        />
      ))}
      <div className="sticky top-0 h-svh overflow-hidden">
        {projects.map((project, i) => (
          <ProjectLayer
            key={project.name}
            project={project}
            index={i}
            total={projects.length}
            inputRange={layers[i].inputRange}
            outputRange={layers[i].outputRange}
            anchors={anchors[i]}
            sectionProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};
