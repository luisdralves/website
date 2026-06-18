"use client";

import {
  AnimatePresence,
  easeIn,
  easeOut,
  type MotionValue,
  m,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/content/projects";
import { linear, PHASES, VISUAL_BODY } from "./lifecycle";

type ScaledIframeProps = {
  src: string;
  alt: string;
  simulatedWidth: number;
  aspectRatio?: number;
};

const ScaledIframe = ({ src, alt, simulatedWidth, aspectRatio = 16 / 10 }: ScaledIframeProps) => {
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / simulatedWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [simulatedWidth]);

  const simulatedHeight = simulatedWidth / aspectRatio;

  return (
    <a
      ref={wrapperRef}
      href={src}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={alt}
      className="absolute inset-0 block overflow-hidden"
    >
      <iframe
        src={src}
        title={alt}
        loading="lazy"
        tabIndex={-1}
        className="pointer-events-none origin-top-left border-0 bg-background"
        style={{
          width: `${simulatedWidth}px`,
          height: `${simulatedHeight}px`,
          transform: `scale(${scale})`,
        }}
      />
    </a>
  );
};

type VisualShowcaseProps = {
  media: readonly ProjectMedia[];
  localProgress: MotionValue<number>;
  priority?: boolean;
  sideSign: -1 | 1;
};

const renderMedia = (item: ProjectMedia, priority: boolean) => {
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

export const VisualShowcase = ({
  media,
  localProgress,
  priority = false,
  sideSign,
}: VisualShowcaseProps) => {
  const bodyProgress = useTransform(localProgress, [VISUAL_BODY.start, VISUAL_BODY.end], [0, 1], {
    clamp: true,
  });

  const [index, setIndex] = useState(0);

  useMotionValueEvent(bodyProgress, "change", (value) => {
    if (media.length <= 1) return;
    const next = Math.max(0, Math.min(Math.floor(value * media.length), media.length - 1));
    setIndex((prev) => (prev === next ? prev : next));
  });

  const { enterStart, enterEnd, exitStart, exitEnd } = PHASES.visual;

  const opacity = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
    { ease: [easeOut, linear, easeIn] },
  );
  const scale = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0.88, 1, 1, 0.84],
    { ease: [easeOut, linear, easeIn] },
  );
  const rotate = useTransform(
    localProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [sideSign * -3, 0, 0, sideSign * 3],
    { ease: [easeOut, linear, easeIn] },
  );
  const filter = useTransform(localProgress, [exitStart, exitEnd], ["blur(0px)", "blur(10px)"], {
    clamp: true,
  });
  const enterClip = useTransform(localProgress, [enterStart, enterEnd], [0, 110], { clamp: true });
  const clipPath = useTransform(enterClip, (v) => `circle(${v}% at 50% 50%)`);

  const item = media[index];
  if (!item) return null;

  return (
    <m.div style={{ opacity, scale, rotate, filter }} className="relative w-full">
      <m.div
        style={{ clipPath }}
        className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-foreground/4 ring-1 ring-foreground/10 ring-inset"
      >
        <AnimatePresence mode="sync">
          <m.div
            key={index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0"
          >
            {renderMedia(item, priority)}
          </m.div>
        </AnimatePresence>
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
                i === index
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
