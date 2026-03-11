import { exec } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import mime from "mime";
import { type NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const execAsync = promisify(exec);

const IMMICH_API_URL = process.env.IMMICH_API_URL ?? "";
const IMMICH_API_KEY = process.env.IMMICH_API_KEY ?? "";

async function stripMetadata(input: Buffer, id: string): Promise<Buffer> {
  const dir = join(tmpdir(), "photo-proxy");
  await mkdir(dir, { recursive: true });
  const tempFile = join(dir, `${id}.tmp`);

  try {
    await writeFile(tempFile, input);
    await execAsync(
      `exiftool -all= -tagsfromfile @ -Orientation -ICC_Profile -overwrite_original "${tempFile}"`,
    );
    return await readFile(tempFile);
  } finally {
    await rm(tempFile, { force: true });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { allowed } = rateLimit(request, "photo-asset", 120, 60_000);
  if (!allowed) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const { path } = await params;
  const fullPath = path.join("/");

  const match = fullPath.match(
    /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(\w+)$/i,
  );
  if (!match) {
    return new NextResponse("Invalid path format", { status: 400 });
  }

  const [, id, ext] = match;
  const contentType = mime.getType(ext) ?? "application/octet-stream";

  if (!IMMICH_API_URL || !IMMICH_API_KEY) {
    console.warn("[photos] Missing Immich configuration for asset proxy");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  const immichUrl = `${IMMICH_API_URL}/assets/${id}/original`;

  const response = await fetch(immichUrl, {
    headers: {
      "x-api-key": IMMICH_API_KEY,
    },
  });

  if (!response.ok) {
    return new NextResponse("Image not found", { status: response.status });
  }

  const originalBuffer = Buffer.from(await response.arrayBuffer());

  let strippedBuffer: Buffer;
  try {
    strippedBuffer = await stripMetadata(originalBuffer, id);
  } catch (err) {
    console.warn("[photos] Metadata stripping failed:", err);
    return new NextResponse("Failed to process image", { status: 500 });
  }

  const etag = `"${id}"`;

  return new NextResponse(strippedBuffer as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
    },
  });
}
