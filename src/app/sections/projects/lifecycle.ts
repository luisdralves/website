export type Phase = {
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
};

export type Anchors = { pFirst: number; pLast: number };

// Reference window used to normalize RAW_PHASES into [0, 1].
const ENTER_REF = 0.36;
const EXIT_REF = 0.64;

const RAW_PHASES = {
  placard: { enterStart: 0.0, enterEnd: 0.08, exitStart: 0.92, exitEnd: 1.0 },
  hook: { enterStart: 0.0, enterEnd: 0.16, exitStart: 0.84, exitEnd: 1.0 },
  description: { enterStart: 0.08, enterEnd: 0.24, exitStart: 0.78, exitEnd: 0.94 },
  visual: { enterStart: 0.0, enterEnd: 0.36, exitStart: 0.64, exitEnd: 1.0 },
  techKeys: { enterStart: 0.12, enterEnd: 0.34, exitStart: 0.66, exitEnd: 0.9 },
  links: { enterStart: 0.18, enterEnd: 0.36, exitStart: 0.64, exitEnd: 0.82 },
} as const satisfies Record<string, Phase>;

// Invariant: every phase's enterEnd must sit at or before ENTER_REF, and exitStart at or after
// EXIT_REF. Otherwise normalization produces out-of-range values and the choreography breaks
// silently. Enforced in dev so edits to RAW_PHASES that violate the contract surface immediately.
if (process.env.NODE_ENV !== "production") {
  for (const [key, p] of Object.entries(RAW_PHASES) as [keyof typeof RAW_PHASES, Phase][]) {
    if (p.enterEnd > ENTER_REF) {
      throw new Error(
        `RAW_PHASES.${key}.enterEnd (${p.enterEnd}) exceeds ENTER_REF (${ENTER_REF}).`,
      );
    }
    if (p.exitStart < EXIT_REF) {
      throw new Error(
        `RAW_PHASES.${key}.exitStart (${p.exitStart}) is below EXIT_REF (${EXIT_REF}).`,
      );
    }
  }
}

export type PhaseKey = keyof typeof RAW_PHASES;

const PHASE_NORM: Record<PhaseKey, Phase> = (
  Object.entries(RAW_PHASES) as [PhaseKey, Phase][]
).reduce(
  (acc, [k, p]) => {
    acc[k] = {
      enterStart: p.enterStart / ENTER_REF,
      enterEnd: p.enterEnd / ENTER_REF,
      exitStart: (p.exitStart - EXIT_REF) / (1 - EXIT_REF),
      exitEnd: (p.exitEnd - EXIT_REF) / (1 - EXIT_REF),
    };
    return acc;
  },
  {} as Record<PhaseKey, Phase>,
);

/**
 * Project-local phase for a given element under a project's anchors.
 * - Entries are squeezed into [0, pFirst]; exits into [pLast, 1].
 * - No plateau between pFirst and pLast for elements whose normalized enterEnd/exitStart
 *   are both at the window boundary (e.g., visual). Chrome elements with smaller normalized
 *   windows finish earlier within the entry budget and start exiting later within the exit
 *   budget, preserving stagger.
 */
export const phaseFor = (key: PhaseKey, anchors: Anchors): Phase => {
  const n = PHASE_NORM[key];
  return {
    enterStart: n.enterStart * anchors.pFirst,
    enterEnd: n.enterEnd * anchors.pFirst,
    exitStart: anchors.pLast + n.exitStart * (1 - anchors.pLast),
    exitEnd: anchors.pLast + n.exitEnd * (1 - anchors.pLast),
  };
};

/**
 * Project anchors derived from its scroll-pixel budget.
 * - Entry budget = exit budget = basePx / 2 (in pixels).
 * - Cycle (slide-to-slide travel) consumes the remaining (N-1) * extraPx.
 * - Result: peaks are always separated by extraPx px, regardless of slide count.
 */
export const anchorsFor = (slideCount: number, basePx: number, extraPx: number): Anchors => {
  const N = Math.max(1, slideCount);
  if (N === 1) return { pFirst: 0.5, pLast: 0.5 };
  const total = basePx + (N - 1) * extraPx;
  const entry = basePx / 2 / total;
  return { pFirst: entry, pLast: 1 - entry };
};

/** Local progress at which slide j is fully visible (its single stable point). */
export const peakProgressFor = (
  slideIndex: number,
  slideCount: number,
  anchors: Anchors,
): number => {
  if (slideCount <= 1) return (anchors.pFirst + anchors.pLast) / 2;
  return anchors.pFirst + (slideIndex * (anchors.pLast - anchors.pFirst)) / (slideCount - 1);
};

export const linear = (t: number) => t;

export const stagger = (
  phase: Phase,
  index: number,
  total: number,
  staggerFraction = 0.5,
  reverseExit = false,
): Phase => {
  if (total <= 1) return phase;
  const enterWindow = phase.enterEnd - phase.enterStart;
  const exitWindow = phase.exitEnd - phase.exitStart;
  const enterPer = enterWindow * (1 - staggerFraction);
  const exitPer = exitWindow * (1 - staggerFraction);
  const enterStep = (enterWindow * staggerFraction) / (total - 1);
  const exitStep = (exitWindow * staggerFraction) / (total - 1);
  const exitIndex = reverseExit ? total - 1 - index : index;
  return {
    enterStart: phase.enterStart + index * enterStep,
    enterEnd: phase.enterStart + index * enterStep + enterPer,
    exitStart: phase.exitStart + exitIndex * exitStep,
    exitEnd: phase.exitStart + exitIndex * exitStep + exitPer,
  };
};
