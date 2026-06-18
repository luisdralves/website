/**
 * Minimal renderer for vara-format stroke fonts: turns a string into an SVG of
 * cursive/handwritten stroke paths, each pre-set to be invisible (opacity 0,
 * stroke-dashoffset at full length). Lifted and trimmed from vara.js — the
 * animation/queue/multi-line systems aren't included; we drive the dashoffsets
 * ourselves from scroll progress in the consumer.
 *
 * Single line, no word-wrap, no letterSpacing, no minWidth. If the consumer
 * needs those, port them back in.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

type FontPath = {
  d: string;
  mx: number;
  my: number;
};

type FontCharacter = {
  paths: FontPath[];
  w: number;
};

export type HandwritingFont = {
  /** Properties shared across the whole font. */
  p: {
    /** stroke-linecap (e.g. "round"). */
    slc: string;
    /** stroke-linejoin. */
    slj: string;
    /** Default stroke width (the consumer can override via options). */
    bsw: number;
    /** Line height (unused here — single-line only). */
    lh: number;
    /** Width of the space character, in font units. */
    space: number;
    /** Top-factor: used to vertically anchor the baseline. */
    tf: number;
  };
  /** Characters, keyed by charCode as a string. */
  c: Record<string, FontCharacter | undefined>;
};

export type RenderHandwritingOptions = {
  fontSize: number;
  strokeWidth: number;
  color: string;
};

const fontCache = new Map<string, Promise<HandwritingFont>>();

export const fetchFont = (url: string): Promise<HandwritingFont> => {
  const existing = fontCache.get(url);
  if (existing) return existing;
  const promise = fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
    return res.json() as Promise<HandwritingFont>;
  });
  fontCache.set(url, promise);
  return promise;
};

const createNode = <K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] => {
  const el = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttributeNS(null, key, String(value));
  }
  return el;
};

/** Replaces the element's transform with an absolute translate, matching vara's setPosition for absolute coordinates. */
const setAbsoluteTranslate = (el: SVGGraphicsElement, x: number, y: number) => {
  const bbox = el.getBBox();
  el.setAttribute("transform", `translate(${x},${y - bbox.y})`);
};

/**
 * Renders the given text using the font's stroke paths into a freshly-created
 * SVG appended to `container`. Returns the SVG element so the caller can
 * inspect bbox, harvest paths, etc.
 */
export const renderHandwriting = (
  container: HTMLElement,
  font: HandwritingFont,
  text: string,
  options: RenderHandwritingOptions,
): SVGSVGElement => {
  const { fontSize, strokeWidth, color } = options;
  const { slc, slj, space: spaceWidth, tf } = font.p;

  const svg = createNode("svg", { width: "100%" });
  container.appendChild(svg);

  const questionMark = font.c["63"];
  const spacePaths: FontPath[] = [{ d: `M0,0 l${spaceWidth} 0`, mx: 0, my: 0 }];

  const outerLayer = createNode("g", { class: "outer", transform: "translate(0,0)" });
  svg.appendChild(outerLayer);

  const lineGroup = createNode("g", {});
  outerLayer.appendChild(lineGroup);

  let cursorX = 0;
  let largestHeight = 0;

  for (const char of text) {
    const isSpace = char === " ";
    const code = char.charCodeAt(0).toString();
    const charData = isSpace ? undefined : (font.c[code] ?? questionMark);
    const paths = isSpace ? spacePaths : (charData?.paths ?? []);
    const strokeColor = isSpace ? "transparent" : color;

    const charGroup = createNode("g", {});
    lineGroup.appendChild(charGroup);

    for (const pathDef of paths) {
      const path = createNode("path", {
        d: pathDef.d,
        "stroke-width": strokeWidth,
        stroke: strokeColor,
        fill: "none",
        "stroke-linecap": slc,
        "stroke-linejoin": slj,
      });
      charGroup.appendChild(path);
      path.setAttribute("transform", `translate(${pathDef.mx},${-pathDef.my})`);

      const candidate = pathDef.my - path.getBBox().y;
      if (candidate > largestHeight) largestHeight = candidate;

      path.style.opacity = "0";
      const length = path.getTotalLength();
      // The +1/+2 trick keeps a tiny pre-dash so round linecaps don't render a stray dot at the start.
      path.style.strokeDasharray = `${length} ${length + 2}`;
      path.style.strokeDashoffset = `${length + 1}`;
    }

    const correction = charGroup.getBBox().x * fontSize;
    charGroup.setAttribute("transform", `translate(${cursorX - correction},0) scale(${fontSize})`);
    cursorX += charGroup.getBBox().width * fontSize;
  }

  // Anchor the baseline. Matches vara's absolute setPosition (subtracts bbox.y to align top-of-bbox to the y target).
  setAbsoluteTranslate(lineGroup, 0, tf * fontSize - largestHeight);
  setAbsoluteTranslate(outerLayer, 0, 0);

  return svg;
};
