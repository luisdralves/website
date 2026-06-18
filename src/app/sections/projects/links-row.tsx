"use client";

import { easeIn, easeOut, type MotionValue, m, useTransform } from "motion/react";
import type { ReactNode } from "react";
import type { Project } from "@/content/projects";
import { linear, PHASES, stagger } from "./lifecycle";
import { LiveLink, SourceLink } from "./source-link";

type LinksRowProps = {
  project: Project;
  localProgress: MotionValue<number>;
  sideSign: -1 | 1;
};

type LinkWrapperProps = {
  index: number;
  total: number;
  localProgress: MotionValue<number>;
  sideSign: -1 | 1;
  children: ReactNode;
};

const LinkWrapper = ({ index, total, localProgress, sideSign, children }: LinkWrapperProps) => {
  const phase = stagger(PHASES.links, index, total, 0.5, true);
  const { enterStart, enterEnd, exitStart, exitEnd } = phase;
  const offEdge = -40 * sideSign;

  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeOut, linear, easeIn] },
  );
  const x = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [offEdge, 0, 0, offEdge],
    { ease: [easeOut, linear, easeIn] },
  );

  return (
    <m.div style={{ opacity, x }} className="inline-flex">
      {children}
    </m.div>
  );
};

export const LinksRow = ({ project, localProgress, sideSign }: LinksRowProps) => {
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
        >
          {item.node}
        </LinkWrapper>
      ))}
    </div>
  );
};
