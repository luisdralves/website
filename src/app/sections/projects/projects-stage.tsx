"use client";

import { useScroll } from "motion/react";
import { useMemo, useRef } from "react";
import type { Project } from "@/content/projects";
import { MAX_ENTER_END, MIN_EXIT_START } from "./lifecycle";
import { ProjectLayer } from "./project-layer";

const BASE_VH = 160;
const EXTRA_VH = 80;
const OVERLAP_VH = 40;
/**
 * Pre-/post-engagement zones, in vh. Equal to one viewport (sticky engages when
 * section.top reaches viewport.top, disengages when section.bottom reaches viewport.bottom).
 * Used to allocate scroll space for the first project's entrance and the last project's exit
 * so that their per-element choreography plays exactly across the section's approach/departure.
 */
const PRE_BUFFER_VH = 150;
const POST_BUFFER_VH = 150;

type ProjectsStageProps = {
  projects: readonly Project[];
};

type LayerRange = {
  inputRange: number[];
  outputRange: number[];
};

type Layout = {
  layers: LayerRange[];
  sectionVh: number;
};

const computeLayout = (projects: readonly Project[]): Layout => {
  const lastIndex = projects.length - 1;
  const weights = projects.map((p, i) => {
    let w = BASE_VH + (p.media.length - 1) * EXTRA_VH;
    if (i === 0) w += PRE_BUFFER_VH;
    if (i === lastIndex) w += POST_BUFFER_VH;
    return w;
  });

  const rawRanges: { start: number; end: number }[] = [];
  let cursor = 0;
  for (let i = 0; i < weights.length; i++) {
    if (i > 0) cursor -= OVERLAP_VH;
    rawRanges.push({ start: cursor, end: cursor + weights[i] });
    cursor += weights[i];
  }

  // Total widened scroll = pre + content + post = section + viewport
  const totalWidenedVh = cursor;
  const sectionVh = totalWidenedVh - 100;
  const stickyEngageProgress = PRE_BUFFER_VH / totalWidenedVh;
  const stickyDisengageProgress = (totalWidenedVh - POST_BUFFER_VH) / totalWidenedVh;

  const layers: LayerRange[] = rawRanges.map((r, i) => {
    const startProgress = r.start / totalWidenedVh;
    const endProgress = r.end / totalWidenedVh;

    if (i === 0) {
      return {
        inputRange: [startProgress, stickyEngageProgress, endProgress],
        outputRange: [0, MAX_ENTER_END, 1],
      };
    }
    if (i === lastIndex) {
      return {
        inputRange: [startProgress, stickyDisengageProgress, endProgress],
        outputRange: [0, MIN_EXIT_START, 1],
      };
    }
    return {
      inputRange: [startProgress, endProgress],
      outputRange: [0, 1],
    };
  });

  return { layers, sectionVh };
};

export const ProjectsStage = ({ projects }: ProjectsStageProps) => {
  const { layers, sectionVh } = useMemo(() => computeLayout(projects), [projects]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${sectionVh}vh` }}
      data-projects-stage
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {projects.map((project, i) => (
          <ProjectLayer
            key={project.name}
            project={project}
            index={i}
            total={projects.length}
            inputRange={layers[i].inputRange}
            outputRange={layers[i].outputRange}
            sectionProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};
