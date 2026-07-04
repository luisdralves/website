"use client";

import { m } from "motion/react";
import type { FC, SVGProps } from "react";
import DocumentIcon from "@/components/icons/document.svg";
import GiteaIcon from "@/components/icons/gitea.svg";
import GitHubIcon from "@/components/icons/github.svg";
import LinkedInIcon from "@/components/icons/linkedin.svg";
import MailIcon from "@/components/icons/mail.svg";
import SourceIcon from "@/components/icons/source.svg";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";

type Link = {
  platform: string;
  url: string;
};

type SocialLinksProps = {
  links: readonly Link[];
};

const PLATFORM_ICONS: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  Email: MailIcon,
  GitHub: GitHubIcon,
  Gitea: GiteaIcon,
  LinkedIn: LinkedInIcon,
  CV: DocumentIcon,
};

const SocialLink = ({ link }: { link: Link }) => {
  const hover = useMagneticSpringHover<HTMLAnchorElement>({
    magnetStrength: 0.22,
    scaleAmount: 1.05,
    shadowElevation: 0,
  });
  const Icon = PLATFORM_ICONS[link.platform] ?? SourceIcon;

  return (
    <m.a
      ref={hover.ref}
      style={{ ...hover.style, boxShadow: "none" }}
      {...hover.handlers}
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/2 px-5 py-2.5 font-body text-foreground/80 text-sm transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
    >
      <Icon className="size-4" />
      <span>{link.platform}</span>
    </m.a>
  );
};

export const SocialLinks = ({ links }: SocialLinksProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {links.map((link) => (
        <SocialLink key={link.url} link={link} />
      ))}
    </div>
  );
};
