"use client";

import { m, useReducedMotion } from "motion/react";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";
import { springGentle } from "@/lib/motion";
import { formatExifLine } from "./exif";
import type { PhotoItem } from "./types";

type PhotoTileProps = {
  photo: PhotoItem;
  apiUrl: string;
  onSelect: () => void;
};

export const PhotoTile = ({ photo, apiUrl, onSelect }: PhotoTileProps) => {
  const shouldReduceMotion = useReducedMotion();
  const hover = useMagneticSpringHover<HTMLDivElement>({
    magnetStrength: 0.15,
    scaleAmount: 1.03,
    shadowElevation: 12,
  });

  const exifLine = formatExifLine(photo);
  const lensName = photo.exif.lensDisplayName;
  const hasOverlay = exifLine || lensName;

  return (
    <m.div
      ref={hover.ref}
      style={hover.style}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={springGentle}
      className="group relative overflow-hidden rounded-lg shadow-sm transition-shadow duration-200 hover:z-10 hover:shadow-2xl hover:shadow-black/30"
      {...hover.handlers}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label="Open photo"
        className="block w-full cursor-pointer"
      >
        {/* biome-ignore lint/performance/noImgElement: thumbnails are pre-optimized upstream */}
        <img
          src={`${apiUrl}/img/${photo.id}?size=preview`}
          alt=""
          width={photo.width}
          height={photo.height}
          loading="lazy"
          className="block w-full"
        />
        {hasOverlay && (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-1 bg-linear-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {lensName && <p className="font-mono text-white/90 text-xs">{lensName}</p>}
            {exifLine && <p className="font-mono text-white/60 text-xs">{exifLine}</p>}
          </div>
        )}
      </button>
    </m.div>
  );
};
