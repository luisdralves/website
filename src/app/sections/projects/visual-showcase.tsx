"use client";

import { easeInOut, type MotionValue, m, useMotionValueEvent, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ArrowUpRightIcon from "@/components/icons/arrow-up-right.svg";
import type { ProjectMedia } from "@/content/projects";
import { type Anchors, linear, peakProgressFor, phaseFor } from "./lifecycle";
import { ScaledIframe } from "./scaled-iframe";

type VisualShowcaseProps = {
  media: readonly ProjectMedia[];
  localProgress: MotionValue<number>;
  priority?: boolean;
  sideSign: -1 | 1;
  active: boolean;
  anchors: Anchors;
};

const renderMedia = (item: ProjectMedia, priority: boolean, active: boolean) => {
  switch (item.type) {
    case "image":
      return (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="object-cover"
        />
      );
    case "video":
      return (
        <video
          src={item.src}
          poster={item.poster}
          aria-label={item.alt}
          autoPlay
          loop
          muted
          playsInline
          className="size-full object-cover"
        />
      );
    case "iframe":
      if (!active) {
        return (
          <noscript>
            <a
              href={item.src}
              target="_blank"
              rel="noreferrer noopener"
              className="flex size-full items-center justify-center gap-2 bg-foreground/[0.04] font-mono text-foreground/60 text-sm"
            >
              <span>Open live demo</span>
              <ArrowUpRightIcon className="size-4" />
            </a>
          </noscript>
        );
      }
      if (item.simulatedWidth) {
        return (
          <ScaledIframe
            src={item.src}
            alt={item.alt}
            simulatedWidth={item.simulatedWidth}
            aspectRatio={item.aspectRatio}
          />
        );
      }
      return (
        <a
          href={item.src}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={item.alt}
          className="block size-full"
        >
          <iframe
            src={item.src}
            title={item.alt}
            loading="lazy"
            tabIndex={-1}
            className="pointer-events-none size-full border-0 bg-background"
          />
        </a>
      );
  }
};

type SlideLayerProps = {
  item: ProjectMedia;
  index: number;
  totalSlides: number;
  peaks: number[];
  localProgress: MotionValue<number>;
  priority: boolean;
  active: boolean;
};

const SlideLayer = ({
  item,
  index,
  totalSlides,
  peaks,
  localProgress,
  priority,
  active,
}: SlideLayerProps) => {
  const [input, output] = useMemo<[number[], number[]]>(() => {
    if (totalSlides === 1)
      return [
        [0, 1],
        [1, 1],
      ];
    if (index === 0)
      return [
        [peaks[0], peaks[1]],
        [1, 0],
      ];
    if (index === totalSlides - 1) {
      return [
        [peaks[totalSlides - 2], peaks[totalSlides - 1]],
        [0, 1],
      ];
    }
    return [
      [peaks[index - 1], peaks[index], peaks[index + 1]],
      [0, 1, 0],
    ];
  }, [index, totalSlides, peaks]);

  const opacity = useTransform(localProgress, input, output, {
    ease: easeInOut,
    clamp: true,
  });

  return (
    <m.div style={{ opacity }} className="absolute inset-0">
      {renderMedia(item, priority, active)}
    </m.div>
  );
};

export const VisualShowcase = ({
  media,
  localProgress,
  priority = false,
  sideSign,
  active,
  anchors,
}: VisualShowcaseProps) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: media.map identity is irrelevant; media.length covers array changes
  const peaks = useMemo(
    () => media.map((_, j) => peakProgressFor(j, media.length, anchors)),
    [media.length, anchors],
  );

  // Slide is mountable when L lies inside its visible window [peak_{j-1}, peak_{j+1}],
  // with a small margin so the slide is already mounted by the time its opacity becomes non-zero.
  const MARGIN = 0.01;
  // biome-ignore lint/correctness/useExhaustiveDependencies: media.map identity is irrelevant; media.length covers array changes
  const windowFor = useMemo(
    () =>
      media.map((_, j) => ({
        from: j > 0 ? peaks[j - 1] - MARGIN : Number.NEGATIVE_INFINITY,
        to: j < media.length - 1 ? peaks[j + 1] + MARGIN : Number.POSITIVE_INFINITY,
      })),
    [media.length, peaks],
  );

  const compute = (L: number) => {
    const mounted: number[] = [];
    let dominantJ = 0;
    let dominantDist = Number.POSITIVE_INFINITY;
    for (let j = 0; j < media.length; j++) {
      const w = windowFor[j];
      if (L >= w.from && L <= w.to) mounted.push(j);
      const dist = Math.abs(L - peaks[j]);
      if (dist < dominantDist) {
        dominantDist = dist;
        dominantJ = j;
      }
    }
    return { mounted, dominantJ };
  };

  const [mountedIndices, setMountedIndices] = useState<number[]>(media.length > 0 ? [0] : []);
  const [dominantIndex, setDominantIndex] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: one-shot initial sync; subsequent updates flow through useMotionValueEvent
  useEffect(() => {
    const { mounted, dominantJ } = compute(localProgress.get());
    setMountedIndices(mounted);
    setDominantIndex(dominantJ);
  }, []);

  useMotionValueEvent(localProgress, "change", (L) => {
    const { mounted, dominantJ } = compute(L);
    setMountedIndices((prev) =>
      prev.length === mounted.length && prev.every((v, i) => v === mounted[i]) ? prev : mounted,
    );
    setDominantIndex((prev) => (prev === dominantJ ? prev : dominantJ));
  });

  const { enterStart, enterEnd, exitStart, exitEnd } = phaseFor("visual", anchors);

  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const scale = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0.88, 1, 1, 0.84],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const rotate = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [sideSign * -3, 0, 0, sideSign * 3],
    { ease: [easeInOut, linear, easeInOut] },
  );
  const filter = useTransform(localProgress, [exitStart, exitEnd], ["blur(0px)", "blur(10px)"], {
    clamp: true,
    ease: easeInOut,
  });
  const enterClip = useTransform(localProgress, [enterStart, enterEnd], [0, 110], {
    clamp: true,
    ease: easeInOut,
  });
  const clipPath = useTransform(enterClip, (v) => `circle(${v}% at 50% 50%)`);

  if (media.length === 0) return null;

  return (
    <m.div style={{ opacity, scale, rotate, filter }} className="relative w-full">
      <m.div
        style={{ clipPath }}
        className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-foreground/4 ring-1 ring-foreground/10 ring-inset"
      >
        {mountedIndices.map((j) => (
          <SlideLayer
            key={j}
            item={media[j]}
            index={j}
            totalSlides={media.length}
            peaks={peaks}
            localProgress={localProgress}
            priority={priority && j === 0}
            active={active}
          />
        ))}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-[oklch(var(--project-accent)/0.25)] ring-inset"
        />
      </m.div>

      {media.length > 1 ? (
        <div className="mt-4 flex items-center gap-1.5">
          {media.map((_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: media list is static and positional
              key={i}
              className={
                i === dominantIndex
                  ? "h-0.5 w-8 bg-[oklch(var(--project-accent))] transition-all duration-500"
                  : "h-0.5 w-4 bg-foreground/20 transition-all duration-500"
              }
            />
          ))}
        </div>
      ) : null}
    </m.div>
  );
};
