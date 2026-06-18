export type Phase = {
  enterStart: number;
  enterEnd: number;
  exitStart: number;
  exitEnd: number;
};

export const PHASES = {
  placard: { enterStart: 0.0, enterEnd: 0.08, exitStart: 0.92, exitEnd: 1.0 },
  hook: { enterStart: 0.0, enterEnd: 0.16, exitStart: 0.84, exitEnd: 1.0 },
  description: { enterStart: 0.08, enterEnd: 0.24, exitStart: 0.78, exitEnd: 0.94 },
  visual: { enterStart: 0.02, enterEnd: 0.22, exitStart: 0.82, exitEnd: 1.0 },
  techKeys: { enterStart: 0.12, enterEnd: 0.34, exitStart: 0.66, exitEnd: 0.9 },
  links: { enterStart: 0.18, enterEnd: 0.36, exitStart: 0.64, exitEnd: 0.82 },
} satisfies Record<string, Phase>;

export const VISUAL_BODY = { start: 0.22, end: 0.82 } as const;

const allPhases = Object.values(PHASES);
/** Highest enterEnd across all elements — the moment everything has finished entering. */
export const MAX_ENTER_END = Math.max(...allPhases.map((p) => p.enterEnd));
/** Lowest exitStart across all elements — the moment the first element starts exiting. */
export const MIN_EXIT_START = Math.min(...allPhases.map((p) => p.exitStart));

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
