"use client";

import { easeInOut, type MotionValue, m, useTransform } from "motion/react";
import type { ReactNode } from "react";
import type { Project } from "@/content/projects";
import { type Anchors, linear, phaseFor, stagger } from "./lifecycle";
import { LiveLink, SourceLink } from "./source-link";

type LinksRowProps = {
  project: Project;
  localProgress: MotionValue<number>;
  sideSign: -1 | 1;
  anchors: Anchors;
};

type LinkWrapperProps = {
  index: number;
  total: number;
  localProgress: MotionValue<number>;
  sideSign: -1 | 1;
  anchors: Anchors;
  children: ReactNode;
};

const LinkWrapper = ({
  index,
  total,
  localProgress,
  sideSign,
  anchors,
  children,
}: LinkWrapperProps) => {
  const phase = stagger(phaseFor("links", anchors), index, total, 0.5, true);
  const { enterStart, enterEnd, exitStart, exitEnd } = phase;
  const offEdge = -40 * sideSign;

  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const x = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [offEdge, 0, 0, offEdge],
    { ease: [easeInOut, linear, easeInOut] },
  );

  return (
    <m.div style={{ opacity, x }} className="inline-flex">
      {children}
    </m.div>
  );
};

export const LinksRow = ({ project, localProgress, sideSign, anchors }: LinksRowProps) => {
  type Item = { key: string; node: ReactNode };
  const items: Item[] = [];
  if (project.liveUrl) {
    items.push({ key: "live", node: <LiveLink url={project.liveUrl} /> });
  }
  for (const source of project.sources ?? []) {
    items.push({ key: source.url, node: <SourceLink source={source} /> });
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4">
      {items.map((item, i) => (
        <LinkWrapper
          key={item.key}
          index={i}
          total={items.length}
          localProgress={localProgress}
          sideSign={sideSign}
          anchors={anchors}
        >
          {item.node}
        </LinkWrapper>
      ))}
    </div>
  );
};
