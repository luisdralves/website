"use client";

import { m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";
import { springGentle } from "@/lib/motion";
import type { PhotoItem } from "./types";

type PhotoTileProps = {
  photo: PhotoItem;
};

const formatExifLine = (photo: PhotoItem): string | null => {
  const { exif } = photo;
  const parts: string[] = [];

  if (exif.focalLength) parts.push(`${exif.focalLength}mm`);
  if (exif.fNumber) parts.push(`ƒ/${exif.fNumber}`);
  if (exif.exposureTime) parts.push(`${exif.exposureTime}s`);
  if (exif.iso) parts.push(`${exif.iso / 100}\u00A0hISO`);

  return parts.length > 0 ? parts.join(" · ") : null;
};

const formatGearLine = (photo: PhotoItem): string | null => {
  const { exif } = photo;
  const parts: string[] = [];

  if (exif.model) parts.push(exif.model);
  if (exif.lensModel) parts.push(exif.lensModel);

  return parts.length > 0 ? parts.join(" · ") : null;
};

export const PhotoTile = ({ photo }: PhotoTileProps) => {
  const shouldReduceMotion = useReducedMotion();
  const hover = useMagneticSpringHover<HTMLDivElement>({
    magnetStrength: 0.15,
    scaleAmount: 1.03,
    shadowElevation: 12,
  });

  const exifLine = formatExifLine(photo);
  const gearLine = formatGearLine(photo);
  const hasOverlay = exifLine || gearLine;

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
      <a
        href={`/photos/${photo.id}.${photo.ext}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        <Image
          src={`/photos/${photo.id}.${photo.ext}`}
          alt="Photograph without description (sorry)"
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 480px"
          className="w-full"
          loading="lazy"
        />
        {hasOverlay && (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {exifLine && <p className="font-mono text-white/90 text-xs">{exifLine}</p>}
            {gearLine && <p className="font-mono text-white/60 text-xs">{gearLine}</p>}
          </div>
        )}
      </a>
    </m.div>
  );
};
