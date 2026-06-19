"use client";

import { useEffect, useRef, useState } from "react";

type ScaledIframeProps = {
  src: string;
  alt: string;
  simulatedWidth: number;
  aspectRatio?: number;
};

export const ScaledIframe = ({
  src,
  alt,
  simulatedWidth,
  aspectRatio = 16 / 10,
}: ScaledIframeProps) => {
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
