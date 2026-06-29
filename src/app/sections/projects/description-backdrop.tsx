export type DescriptionBand = {
  description: string;
  accent: string;
  heightVh: number;
};

type DescriptionBackdropProps = {
  bands: DescriptionBand[];
  totalVh: number;
};

// Each text row is this tall. Band boundaries are midpoints of overlaps between layout constants
// that are all multiples of 0.05, so each boundary is a multiple of 0.025 and every band height a
// multiple of 2.5svh — a clip at a band's bottom always lands on a row boundary: the hard cut
// between projects never slices a row of glyphs. The tile is ROWS_PER_TILE rows tall (also an
// integer number of rows), so the same holds for the tile's own edges.
const ROW_VH = 2.5;
const ROWS_PER_TILE = 10; // vertical period; larger reads as less repetitive
const GOLDEN = (Math.sqrt(5) - 1) / 2; // 1/φ, a low-discrepancy per-row offset that keeps rows from lining up
const TILE_FILL = 0.03; // text alpha
const FONT_UNITS = 74; // glyph size within each 100-unit-tall row

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * One repeating-text tile per project, as an inline SVG `background-image`. The tile stacks
 * ROWS_PER_TILE rows of the (uppercased) description, each shifted horizontally by a golden-ratio
 * step so the rows don't form visible columns or a short repeating pattern. Each row is drawn as
 * two copies (at `offset` and `offset - w`); the SVG viewport clips them to `[0, w]`, leaving one
 * row whose left and right edges share a phase, so the horizontal `background-repeat` lines up for
 * any offset. Compositor tiling is cheaper than laying out thousands of DOM words and won't
 * underfill. One catch: an SVG background renders in isolation and can't use the page's web fonts,
 * so the texture falls back to a generic sans-serif.
 */
const tileFor = (description: string, accent: string): string => {
  const text = escapeXml(`${description} `.toUpperCase());
  const w = Math.round((description.length + 1) * FONT_UNITS * 0.6);
  const height = ROWS_PER_TILE * 100;

  let rows = "";
  for (let k = 0; k < ROWS_PER_TILE; k++) {
    const offset = Math.round(((k * GOLDEN) % 1) * w);
    const y = k * 100 + 77;
    rows +=
      `<text x="${offset}" y="${y}" textLength="${w}" lengthAdjust="spacing">${text}</text>` +
      `<text x="${offset - w}" y="${y}" textLength="${w}" lengthAdjust="spacing">${text}</text>`;
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" width="${w}" height="${height}">` +
    `<g font-family="'Space Grotesk',system-ui,sans-serif" font-weight="600" font-size="${FONT_UNITS}" ` +
    `fill="oklch(${accent} / ${TILE_FILL})">${rows}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/**
 * A single continuous strip behind the pinned project content, partitioned into one band per
 * project. Each band's height equals that project's share of the section's scroll budget, so the
 * bands meet at a hard edge with no fade between them. The strip is plain document flow, so it
 * scrolls (and snaps) naturally; its `top: -50svh` origin maps strip-y `w * 100svh` to widened
 * coordinate `w`, the same mapping the snap markers use, so each band tracks the scroll span its
 * project owns. The wrapper clips the strip's overhang to the section box without making the
 * section a scroll container (which would break the sibling sticky layer).
 */
export const DescriptionBackdrop = ({ bands, totalVh }: DescriptionBackdropProps) => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-x-0 top-[-50svh]" style={{ height: `${totalVh}svh` }}>
      {bands.map((band, i) => (
        <div
          key={`band-${i}-${band.description.slice(0, 16)}`}
          style={{
            height: `${band.heightVh}svh`,
            backgroundImage: tileFor(band.description, band.accent),
            backgroundRepeat: "repeat",
            backgroundSize: `auto ${ROW_VH * ROWS_PER_TILE}svh`,
          }}
        />
      ))}
    </div>
  </div>
);
