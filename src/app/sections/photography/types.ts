export type PhotoItem = {
  id: string;
  width: number;
  height: number;
  ext: string;
  rating: number;
  exif: {
    fNumber: number | null;
    exposureTime: string | null;
    iso: number | null;
    focalLength: number | null;
    model: string | null;
    lensModel: string | null;
  };
};
