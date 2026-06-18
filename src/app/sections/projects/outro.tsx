"use client";

import { m } from "motion/react";
import ArrowUpRight from "@/components/icons/arrow-up-right.svg";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";
import { resolveHost } from "@/lib/host-icons";

type ProfileLinkProps = {
  url: string;
};

const ProfileLink = ({ url }: ProfileLinkProps) => {
  const hover = useMagneticSpringHover<HTMLAnchorElement>({
    magnetStrength: 0.25,
    scaleAmount: 1.04,
    shadowElevation: 12,
  });
  const { Icon, name } = resolveHost(url);

  return (
    <m.a
      ref={hover.ref}
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      style={hover.style}
      {...hover.handlers}
      className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-foreground/15 bg-foreground/3 px-6 py-3 font-heading text-lg backdrop-blur-sm"
    >
      <Icon className="size-5" />
      <span>{name}</span>
      <ArrowUpRight className="size-4 text-foreground/60" />
    </m.a>
  );
};

type OutroProps = {
  profileUrls: string[];
};

export const Outro = ({ profileUrls }: OutroProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-foreground text-xl">{"But wait, there's more!"}</p>
        <p className="text-foreground/45 text-sm">
          {"It's just that this was getting a little long"}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        {profileUrls.map((url) => (
          <ProfileLink key={url} url={url} />
        ))}
      </div>
    </div>
  );
};
