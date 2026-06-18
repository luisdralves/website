"use client";

import { m } from "motion/react";
import { springSnappy } from "@/lib/motion";
import { getTechEntry } from "@/lib/tech-registry";

type TechKeyProps = {
  techKey: string;
};

export const TechKey = ({ techKey }: TechKeyProps) => {
  const { label, url } = getTechEntry(techKey);
  const Wrapper = url ? m.a : m.div;

  return (
    <Wrapper
      href={url}
      target={url ? "_blank" : undefined}
      rel={url ? "noreferrer noopener" : undefined}
      whileHover="hovered"
      whileTap="pressed"
      transition={springSnappy}
      className="group relative inline-block select-none pb-1.5"
    >
      <span
        aria-hidden
        className="absolute inset-0 top-1.5 rounded-md bg-foreground/10 ring-1 ring-foreground/15 ring-inset transition-colors duration-200 group-hover:bg-[oklch(var(--project-accent)/0.18)] group-hover:ring-[oklch(var(--project-accent)/0.45)] group-active:bg-[oklch(var(--project-accent)/0.28)] group-active:ring-[oklch(var(--project-accent)/0.6)]"
      />
      <m.span
        initial={{ y: 0 }}
        variants={{ hovered: { y: 3 }, pressed: { y: 5 } }}
        className="relative block rounded-md border border-foreground/25 bg-background px-3 py-1.5 font-mono text-foreground/80 text-xs leading-none tracking-wide shadow-[inset_0_1px_0_0_oklch(0.94_0.02_90/0.05)] transition-colors duration-200 group-hover:border-[oklch(var(--project-accent)/0.55)] group-hover:text-[oklch(var(--project-accent))] group-active:border-[oklch(var(--project-accent)/0.8)] group-active:text-[oklch(var(--project-accent))]"
      >
        {label}
      </m.span>
    </Wrapper>
  );
};
