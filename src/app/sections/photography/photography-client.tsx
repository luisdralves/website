"use client";

import { m } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";
import { PhotoTile } from "./photo-tile";
import type { PhotoItem } from "./types";

type PhotographyClientProps = {
  apiUrl: string;
};

const LG_BREAKPOINT = 1024;
const GAP_DESKTOP = 16;
const GAP_MOBILE = 8;
const MAX_COLUMN_WIDTH = 400;
const MAX_PAGES = 2;

const getGap = (width: number) => (width >= LG_BREAKPOINT ? GAP_DESKTOP : GAP_MOBILE);

const MIN_COLUMNS = 3;

function computeColumnCount(containerWidth: number, gap: number): number {
  if (containerWidth <= 0) return MIN_COLUMNS;
  return Math.max(MIN_COLUMNS, Math.ceil((containerWidth + gap) / (MAX_COLUMN_WIDTH + gap)));
}

type PhotosResponse = {
  photos: PhotoItem[];
  hasMore: boolean;
};

const fetcher = async (url: string): Promise<PhotosResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    console.error("[photos] API error:", res.status, res.statusText);
    return { photos: [], hasMore: false };
  }
  return res.json();
};

type Column = {
  photos: PhotoItem[];
  height: number;
};

type ColumnCache = {
  columns: Column[];
  photoCount: number;
};

function assignPhotosToColumns(
  cache: ColumnCache | null,
  photos: PhotoItem[],
  columnCount: number,
  columnWidth: number,
  gap: number,
): ColumnCache {
  const needsReset = !cache || cache.columns.length !== columnCount;

  if (needsReset || columnWidth <= 0) {
    const columns: Column[] = Array.from({ length: columnCount }, () => ({
      photos: [],
      height: 0,
    }));

    if (columnWidth > 0) {
      for (const photo of photos) {
        if (photo.width <= 0 || photo.height <= 0) continue;
        const shortest = columns.reduce((min, col) => (col.height < min.height ? col : min));
        shortest.photos.push(photo);
        shortest.height += (photo.height / photo.width) * columnWidth + gap;
      }
    }

    return { columns, photoCount: columnWidth > 0 ? photos.length : 0 };
  }

  if (photos.length > cache.photoCount) {
    const columns = cache.columns.map((col) => ({ ...col, photos: [...col.photos] }));

    for (const photo of photos.slice(cache.photoCount)) {
      if (photo.width <= 0 || photo.height <= 0) continue;
      const shortest = columns.reduce((min, col) => (col.height < min.height ? col : min));
      shortest.photos.push(photo);
      shortest.height += (photo.height / photo.width) * columnWidth + gap;
    }

    return { columns, photoCount: photos.length };
  }

  return cache;
}

export const PhotographyClient = ({ apiUrl }: PhotographyClientProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(MIN_COLUMNS);
  const [columnWidth, setColumnWidth] = useState(0);
  const [gap, setGap] = useState(GAP_DESKTOP);
  const cacheRef = useRef<ColumnCache | null>(null);

  const ctaHover = useMagneticSpringHover<HTMLAnchorElement>({
    magnetStrength: 0.2,
    scaleAmount: 1.04,
    shadowElevation: 16,
  });

  const seed = useMemo(() => Math.random().toString(36).slice(2), []);

  const { data, size, setSize, isValidating } = useSWRInfinite<PhotosResponse>(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.hasMore) return null;
      return `${apiUrl}/api/export?seed=${seed}&page=${pageIndex}`;
    },
    fetcher,
    { revalidateFirstPage: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const photos = data?.flatMap((page) => page.photos) ?? [];
  const upstreamHasMore = data?.[data.length - 1]?.hasMore ?? true;
  const reachedCap = (data?.length ?? 0) >= MAX_PAGES;
  const autoLoad = upstreamHasMore && !reachedCap;

  const columns = useMemo(() => {
    const result = assignPhotosToColumns(cacheRef.current, photos, columnCount, columnWidth, gap);
    cacheRef.current = result;
    return result.columns;
  }, [photos, columnCount, columnWidth, gap]);

  useEffect(() => {
    if (!gridRef.current) return;

    const measure = () => {
      if (!gridRef.current) return;
      const gridWidth = gridRef.current.offsetWidth;
      const g = getGap(window.innerWidth);
      const count = computeColumnCount(gridWidth, g);
      setGap(g);
      setColumnCount(count);
      setColumnWidth((gridWidth - (count - 1) * g) / count);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current || !autoLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isValidating) {
          setSize(size + 1);
        }
      },
      { rootMargin: "100%" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [autoLoad, isValidating, size, setSize]);

  return (
    <>
      <div
        ref={gridRef}
        className="grid"
        style={{ gap, gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {columns.map((column, colIdx) => (
          <div key={`${colIdx}/${columnCount}`} className="flex flex-col" style={{ gap }}>
            {column.photos.map((photo) => (
              <PhotoTile key={photo.id} photo={photo} apiUrl={apiUrl} />
            ))}
          </div>
        ))}
        {autoLoad && <div ref={loadMoreRef} className="col-span-full h-1" />}
      </div>
      {reachedCap && upstreamHasMore && (
        <div className="mt-8 flex justify-center">
          <m.a
            ref={ctaHover.ref}
            style={ctaHover.style}
            {...ctaHover.handlers}
            href={`${apiUrl}/gallery`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg border border-accent-cyan/40 px-6 py-3 font-body text-accent-cyan text-base transition-colors hover:border-accent-cyan/70 hover:bg-accent-cyan/10"
          >
            See the rest of the portfolio
          </m.a>
        </div>
      )}
    </>
  );
};
