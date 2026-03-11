"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { PhotoTile } from "./photo-tile";
import type { PhotoItem } from "./types";

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

const GAP = 16;

const getColumnCount = (width: number) => {
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
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
        shortest.height += (photo.height / photo.width) * columnWidth + GAP;
      }
    }

    return { columns, photoCount: photos.length };
  }

  if (photos.length > cache.photoCount) {
    const columns = cache.columns.map((col) => ({ ...col, photos: [...col.photos] }));

    for (const photo of photos.slice(cache.photoCount)) {
      if (photo.width <= 0 || photo.height <= 0) continue;
      const shortest = columns.reduce((min, col) => (col.height < min.height ? col : min));
      shortest.photos.push(photo);
      shortest.height += (photo.height / photo.width) * columnWidth + GAP;
    }

    return { columns, photoCount: photos.length };
  }

  return cache;
}

export const PhotographyClient = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(4);
  const [columnWidth, setColumnWidth] = useState(0);
  const cacheRef = useRef<ColumnCache | null>(null);

  const seed = useMemo(() => Math.random().toString(36).slice(2), []);

  const { data, size, setSize, isValidating } = useSWRInfinite<PhotosResponse>(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.hasMore) return null;
      return `/api/photos?seed=${seed}&page=${pageIndex + 1}`;
    },
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const photos = data?.flatMap((page) => page.photos) ?? [];
  const hasMore = data?.[data.length - 1]?.hasMore ?? true;
  const columns = useMemo(() => {
    const result = assignPhotosToColumns(cacheRef.current, photos, columnCount, columnWidth);
    cacheRef.current = result;
    return result.columns;
  }, [photos, columnCount, columnWidth]);

  useEffect(() => {
    if (!gridRef.current) return;

    const measure = () => {
      if (!gridRef.current) return;
      const count = getColumnCount(window.innerWidth);
      setColumnCount(count);
      const gridWidth = gridRef.current.offsetWidth;
      const width = (gridWidth - (count - 1) * GAP) / count;
      setColumnWidth(width);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isValidating) {
          setSize(size + 1);
        }
      },
      { rootMargin: "100%" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isValidating, size, setSize]);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      style={{ gap: GAP }}
    >
      {columns.map((column, colIdx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional by nature
        <div key={colIdx} className="flex flex-col" style={{ gap: GAP }}>
          {column.photos.map((photo) => (
            <PhotoTile key={photo.id} photo={photo} />
          ))}
        </div>
      ))}
      <div ref={loadMoreRef} className="col-span-full h-1" />
    </div>
  );
};
