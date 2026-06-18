"use client";

import type { MotionValue } from "motion/react";
import { HookWord } from "./hook-word";

type HookRevealProps = {
  text: string;
  localProgress: MotionValue<number>;
};

type Token = { kind: "word"; text: string; wordIndex: number } | { kind: "space"; text: string };

const tokenize = (text: string): { tokens: Token[]; wordCount: number } => {
  const tokens: Token[] = [];
  let wordIndex = 0;
  for (const match of text.match(/\S+|\s+/g) ?? []) {
    if (/^\s/.test(match)) {
      tokens.push({ kind: "space", text: match });
    } else {
      tokens.push({ kind: "word", text: match, wordIndex });
      wordIndex += 1;
    }
  }
  return { tokens, wordCount: wordIndex };
};

export const HookReveal = ({ text, localProgress }: HookRevealProps) => {
  const { tokens, wordCount } = tokenize(text);

  return (
    <h3 className="font-heading font-semibold desktop:text-5xl text-4xl leading-[1.1] lg:text-6xl">
      {tokens.map((token, i) => {
        if (token.kind === "space") {
          // biome-ignore lint/suspicious/noArrayIndexKey: token positions are stable for a given hook string
          return <span key={i}>{token.text}</span>;
        }
        return (
          <HookWord
            // biome-ignore lint/suspicious/noArrayIndexKey: token positions are stable for a given hook string
            key={i}
            word={token.text}
            index={token.wordIndex}
            total={wordCount}
            localProgress={localProgress}
          />
        );
      })}
    </h3>
  );
};
