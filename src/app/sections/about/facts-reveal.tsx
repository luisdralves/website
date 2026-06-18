"use client";

import { m, type Variants } from "motion/react";
import { useMagneticSpringHover } from "@/hooks/use-magnetic-spring-hover";

type Fact = {
  label: string;
  value: string;
};

type FactsRevealProps = {
  facts: readonly Fact[];
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const FactItem = ({ fact }: { fact: Fact }) => {
  const hover = useMagneticSpringHover<HTMLDivElement>({
    magnetStrength: 0.12,
    scaleAmount: 1.02,
    shadowElevation: 4,
  });

  return (
    <m.div variants={itemVariants} data-scroll-animated="opacity:1;transform:translateY(0px)">
      <m.div
        ref={hover.ref}
        style={{ ...hover.style, boxShadow: "none" }}
        {...hover.handlers}
        className="cursor-default space-y-1"
      >
        <p className="font-body text-sm uppercase tracking-wider opacity-60">{fact.label}</p>
        <p className="font-body text-lg">{fact.value}</p>
      </m.div>
    </m.div>
  );
};

export const FactsReveal = ({ facts }: FactsRevealProps) => {
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="grid gap-x-6 gap-y-18 md:grid-cols-2"
    >
      {facts.map((fact) => (
        <FactItem key={fact.label} fact={fact} />
      ))}
    </m.div>
  );
};
