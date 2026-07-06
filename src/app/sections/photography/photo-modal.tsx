"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef } from "react";
import { ExternalLink } from "@/components/external-link";
import ArrowLeftIcon from "@/components/icons/arrow-left.svg";
import ArrowRightIcon from "@/components/icons/arrow-right.svg";
import CloseIcon from "@/components/icons/close.svg";
import { formatExifLine } from "./exif";
import type { PhotoItem } from "./types";

type PhotoModalProps = {
  photos: PhotoItem[];
  selectedIndex: number | null;
  apiUrl: string;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
};

const chromeButtonClasses =
  "z-10 inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-foreground/15 bg-foreground/3 text-foreground/80 backdrop-blur-sm transition-colors hover:border-accent-cyan/60 hover:text-accent-cyan disabled:cursor-default disabled:opacity-30 disabled:hover:border-foreground/15 disabled:hover:text-foreground/80";

const FOCUSABLE_SELECTOR = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export const PhotoModal = ({
  photos,
  selectedIndex,
  apiUrl,
  onClose,
  onSelectIndex,
}: PhotoModalProps) => {
  const isOpen = selectedIndex !== null;
  const photo = selectedIndex !== null ? photos[selectedIndex] : null;
  const hasPrev = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < photos.length - 1;
  const exifLine = photo ? formatExifLine(photo) : null;
  const lensName = photo?.exif.lensDisplayName ?? null;

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || selectedIndex === null) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (e.key === "ArrowLeft" && selectedIndex > 0) {
        e.preventDefault();
        onSelectIndex(selectedIndex - 1);
        return;
      }
      if (e.key === "ArrowRight" && selectedIndex < photos.length - 1) {
        e.preventDefault();
        onSelectIndex(selectedIndex + 1);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, selectedIndex, photos.length, onClose, onSelectIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const id = requestAnimationFrame(() => {
      const focusables = dialogRef.current
        ? Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        : [];
      focusables[0]?.focus();
    });
    return () => {
      cancelAnimationFrame(id);
      lastFocusedRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && photo ? (
        <m.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={onClose}
          className="fixed inset-0 z-200 flex items-center justify-center bg-background/95 pb-4 backdrop-blur-sm md:pb-6"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            className={`absolute top-4 right-4 ${chromeButtonClasses}`}
          >
            <CloseIcon className="size-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (selectedIndex !== null && hasPrev) onSelectIndex(selectedIndex - 1);
            }}
            aria-label="Previous photo"
            disabled={!hasPrev}
            className={`-translate-y-1/2 absolute top-1/2 left-4 ${chromeButtonClasses}`}
          >
            <ArrowLeftIcon className="size-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (selectedIndex !== null && hasNext) onSelectIndex(selectedIndex + 1);
            }}
            aria-label="Next photo"
            disabled={!hasNext}
            className={`-translate-y-1/2 absolute top-1/2 right-4 ${chromeButtonClasses}`}
          >
            <ArrowRightIcon className="size-5" />
          </button>

          <div className="flex h-full w-full flex-col items-center gap-4">
            <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
              <AnimatePresence initial={false}>
                <m.a
                  key={photo.id}
                  href={`${apiUrl}/assets/${photo.id}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Open photo details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  {/* biome-ignore lint/performance/noImgElement: viewer image is served pre-optimized by rate-my-shots */}
                  <img
                    src={`${apiUrl}/img/${photo.id}?size=preview`}
                    alt=""
                    className="pointer-events-auto max-h-full max-w-full cursor-pointer object-contain"
                  />
                </m.a>
              </AnimatePresence>
            </div>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: stops clicks on chrome from closing the modal */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: defensive click absorber, no keyboard semantics needed */}
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1">
              {lensName && <p className="font-mono text-foreground/80 text-xs">{lensName}</p>}
              {exifLine && <p className="font-mono text-foreground/55 text-xs">{exifLine}</p>}
            </div>
            <ExternalLink
              href={`${apiUrl}/assets/${photo.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-body text-foreground/70 text-sm"
            >
              <span>Details</span>
            </ExternalLink>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
};
