"use client";

import { m } from "motion/react";
import MegaphoneIcon from "@/components/icons/megaphone.svg";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";

type VoiceCtaProps = {
  url: string;
};

export const VoiceCta = ({ url }: VoiceCtaProps) => {
  const hover = useMagneticSpringHover<HTMLAnchorElement>({
    magnetStrength: 0.2,
    scaleAmount: 1.04,
    shadowElevation: 16,
  });

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="font-body text-foreground/45 text-sm">Wanna help?</span>
      <m.a
        ref={hover.ref}
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        style={hover.style}
        {...hover.handlers}
        className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-foreground/15 bg-foreground/3 px-6 py-3 font-heading text-lg backdrop-blur-sm"
      >
        <MegaphoneIcon className="size-5" />
        <span>Make your voice heard</span>
      </m.a>
    </div>
  );
};
