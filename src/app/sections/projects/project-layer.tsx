"use client";

import { type MotionValue, m, useMotionValueEvent, useTransform } from "motion/react";
import { type CSSProperties, useState } from "react";
import type { Project } from "@/content/projects";
import { DescriptionReveal } from "./description-reveal";
import { HookReveal } from "./hook-reveal";
import type { Anchors } from "./lifecycle";
import { LinksRow } from "./links-row";
import { Placard } from "./placard";
import { TechKeyDeck } from "./tech-key-deck";
import { VisualShowcase } from "./visual-showcase";

type ProjectLayerProps = {
  project: Project;
  index: number;
  total: number;
  inputRange: number[];
  outputRange: number[];
  anchors: Anchors;
  sectionProgress: MotionValue<number>;
};

export const ProjectLayer = ({
  project,
  index,
  total,
  inputRange,
  outputRange,
  anchors,
  sectionProgress,
}: ProjectLayerProps) => {
  const localProgress = useTransform(sectionProgress, inputRange, outputRange, {
    clamp: true,
  });

  const sectionStart = inputRange[0];
  const sectionEnd = inputRange[inputRange.length - 1];

  const [active, setActive] = useState(false);
  useMotionValueEvent(sectionProgress, "change", (p) => {
    const next = p >= sectionStart - 0.005 && p <= sectionEnd + 0.005;
    setActive((prev) => (prev === next ? prev : next));
  });

  const visualOnLeft = index % 2 === 1;
  const contentSideSign: -1 | 1 = visualOnLeft ? 1 : -1;
  const visualSideSign: -1 | 1 = visualOnLeft ? -1 : 1;

  const layerStyle = {
    "--project-accent": project.accent,
    pointerEvents: active ? "auto" : "none",
  } as CSSProperties;

  return (
    <m.div
      style={layerStyle}
      data-project-layer
      className="absolute inset-0 flex items-center desktop:px-16 px-8 lg:px-24"
    >
      <div className="mx-auto grid w-full max-w-7xl desktop:grid-cols-2 grid-cols-1 items-center desktop:gap-12 gap-10 lg:gap-20">
        <div className={visualOnLeft ? "desktop:order-2" : "desktop:order-1"}>
          <div className="space-y-6">
            <Placard index={index} total={total} localProgress={localProgress} anchors={anchors} />
            <HookReveal text={project.hook} localProgress={localProgress} anchors={anchors} />
            <DescriptionReveal
              text={project.description}
              localProgress={localProgress}
              anchors={anchors}
            />
            <TechKeyDeck
              techStack={project.techStack}
              localProgress={localProgress}
              anchors={anchors}
            />
            <LinksRow
              project={project}
              localProgress={localProgress}
              sideSign={contentSideSign}
              anchors={anchors}
            />
          </div>
        </div>

        <div className={visualOnLeft ? "desktop:order-1" : "desktop:order-2"}>
          <VisualShowcase
            media={project.media}
            localProgress={localProgress}
            priority={index === 0}
            sideSign={visualSideSign}
            active={active}
            anchors={anchors}
          />
        </div>
      </div>
    </m.div>
  );
};
