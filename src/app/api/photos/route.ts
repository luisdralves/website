import mime from "mime";
import { type NextRequest, NextResponse } from "next/server";
import type { PhotoItem } from "@/app/sections/photography/types";
import { rateLimit } from "@/lib/rate-limit";

const IMMICH_API_URL = process.env.IMMICH_API_URL ?? "";
const IMMICH_API_KEY = process.env.IMMICH_API_KEY ?? "";
const IMMICH_ALBUM_ID = process.env.IMMICH_ALBUM_ID ?? "";
const PAGE_SIZE = 48;

type ImmichAsset = {
  id: string;
  width: number;
  height: number;
  originalMimeType: string;
  exifInfo: {
    rating: number | null;
    fNumber: number | null;
    exposureTime: string | null;
    iso: number | null;
    focalLength: number | null;
    model: string | null;
    lensModel: string | null;
  };
};

type ImmichAlbumResponse = {
  assets: ImmichAsset[];
};

function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 15), hash | 1);
    hash ^= hash + Math.imul(hash ^ (hash >>> 7), hash | 61);
    return ((hash ^ (hash >>> 14)) >>> 0) / 4294967296;
  };
}

function sortByRating(items: PhotoItem[], seed: string): PhotoItem[] {
  const random = seededRandom(seed);
  return [...items].sort((a, b) => {
    const diff = b.rating - a.rating;
    if (diff !== 0) return diff;
    return random() - 0.5;
  });
}

async function fetchAlbum(): Promise<PhotoItem[]> {
  if (!IMMICH_API_URL || !IMMICH_API_KEY || !IMMICH_ALBUM_ID) {
    console.error("[photos] Missing Immich configuration:", {
      hasUrl: !!IMMICH_API_URL,
      hasKey: !!IMMICH_API_KEY,
      hasAlbumId: !!IMMICH_ALBUM_ID,
    });
    return [];
  }

  const response = await fetch(`${IMMICH_API_URL}/albums/${IMMICH_ALBUM_ID}`, {
    headers: {
      "x-api-key": IMMICH_API_KEY,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    console.error("[photos] Immich API error:", response.status, response.statusText);
    return [];
  }

  const data = (await response.json()) as ImmichAlbumResponse;

  return data.assets.map((asset) => ({
    id: asset.id,
    width: asset.width,
    height: asset.height,
    ext: mime.getExtension(asset.originalMimeType) ?? "jpg",
    rating: asset.exifInfo.rating ?? 0,
    exif: {
      fNumber: asset.exifInfo.fNumber,
      exposureTime: asset.exifInfo.exposureTime,
      iso: asset.exifInfo.iso,
      focalLength: asset.exifInfo.focalLength,
      model: asset.exifInfo.model,
      lensModel: asset.exifInfo.lensModel,
    },
  }));
}

export async function GET(request: NextRequest) {
  const { allowed } = rateLimit(request, "photos", 60, 60_000);
  if (!allowed) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const { searchParams } = request.nextUrl;
  const seed = searchParams.get("seed") ?? "default";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  const allPhotos = await fetchAlbum();
  const sorted = sortByRating(allPhotos, seed);

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const photos = sorted.slice(startIndex, endIndex);
  const hasMore = endIndex < sorted.length;

  return NextResponse.json({ photos, hasMore });
}
