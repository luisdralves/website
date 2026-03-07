const TYPE_MEAN = 50;
const TYPE_STDDEV = 35;
const DELETE_DELAY = 30;
const PAUSE_DELAY = 2000;

const randomDelay = (mean: number, stddev: number): number => {
  const u1 = Math.random() || Number.MIN_VALUE;
  const u2 = Math.random();
  const normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(10, Math.round(mean + normal * stddev));
};

export type KeySequence = {
  keys: string[];
  loopStart: number;
  delays: number[];
};

export const generateKeySequence = (prefix: string, suffixes: readonly string[]): KeySequence => {
  const keys: string[] = [];

  for (const char of prefix) {
    keys.push(char);
  }

  const loopStart = keys.length;

  for (const suffix of suffixes) {
    for (const char of suffix) {
      keys.push(char);
    }
    for (let i = 0; i < suffix.length; i++) {
      keys.push("Backspace");
    }
  }

  const delays = keys.map((key, i) => {
    const prevKey = i > 0 ? keys[i - 1] : null;
    const isBackspace = key === "Backspace";

    if (prevKey !== null && prevKey !== "Backspace" && isBackspace) {
      return PAUSE_DELAY;
    }

    if (isBackspace) {
      return DELETE_DELAY;
    }

    return randomDelay(TYPE_MEAN, TYPE_STDDEV);
  });

  return { keys, loopStart, delays };
};
