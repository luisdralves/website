"use client";

import ArrowUpRight from "@/components/icons/arrow-up-right.svg";
import type { ProjectSource } from "@/content/projects";
import { resolveHost } from "@/lib/host-icons";

type SourceLinkProps = {
  source: ProjectSource;
};

export const SourceLink = ({ source }: SourceLinkProps) => {
  const { Icon, name } = resolveHost(source.url);
  const label = source.label ?? name;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group inline-flex items-center gap-1.5 font-body text-foreground/70 text-sm transition-colors duration-200 hover:text-[oklch(var(--project-accent))]"
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
      <ArrowUpRight className="group-hover:-translate-y-0.5 ml-0.5 inline-block size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
};

type LiveLinkProps = {
  url: string;
};

export const LiveLink = ({ url }: LiveLinkProps) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer noopener"
    className="group inline-flex items-center gap-1.5 font-body font-medium text-[oklch(var(--project-accent))] text-sm transition-opacity hover:opacity-80"
  >
    <span className="size-1.5 rounded-full bg-[oklch(var(--project-accent))] shadow-[0_0_8px_oklch(var(--project-accent)/0.8)]" />
    <span>Live</span>
    <ArrowUpRight className="group-hover:-translate-y-0.5 inline-block size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
  </a>
);
