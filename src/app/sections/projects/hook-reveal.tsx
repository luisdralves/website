"use client";

import type { MotionValue } from "motion/react";
import { HookWord } from "./hook-word";
import type { Anchors } from "./lifecycle";

type HookRevealProps = {
  text: string;
  localProgress: MotionValue<number>;
  anchors: Anchors;
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

export const HookReveal = ({ text, localProgress, anchors }: HookRevealProps) => {
  const { tokens, wordCount } = tokenize(text);

  return (
    <h3 className="font-heading font-semibold desktop:text-5xl text-[clamp(1.25rem,6vw,2.25rem)] leading-[1.1] lg:text-6xl">
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
            anchors={anchors}
          />
        );
      })}
    </h3>
  );
};
