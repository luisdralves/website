import type { PhotoItem } from "./types";

const formatExposureTime = (s: number): string => {
  if (s >= 1) return `${s}s`;
  const denom = Math.round(1 / s);
  return `1/${denom}s`;
};

export const formatExifLine = (photo: PhotoItem): string | null => {
  const { exif } = photo;
  const parts: string[] = [];

  if (exif.focalLength) parts.push(`${exif.focalLength}mm`);
  if (exif.fNumber) parts.push(`ƒ/${exif.fNumber}`);
  if (exif.exposureTime) parts.push(formatExposureTime(exif.exposureTime));
  if (exif.iso) parts.push(`${exif.iso / 100}\u00A0hISO`);

  return parts.length > 0 ? parts.join(" · ") : null;
};
