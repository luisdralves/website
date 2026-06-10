export type PhotoItem = {
  id: string;
  width: number;
  height: number;
  eloVerified: number;
  exif: {
    lensDisplayName: string | null;
    focalLength: number | null;
    fNumber: number | null;
    exposureTime: number | null;
    iso: number | null;
  };
};
