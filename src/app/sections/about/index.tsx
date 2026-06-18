import { about } from "@/content/about";
import { BuilderTypewriter } from "./builder-typewriter";
import { generateKeySequence } from "./builder-typewriter/sequence";
import { FactsReveal } from "./facts-reveal";
import { HandwrittenStatement } from "./handwritten-statement";
import { Threshold } from "./threshold";

export const About = () => {
  const { prefix, suffixes } = about.builderPhrase;
  const sequence = generateKeySequence(prefix, suffixes);

  return (
    <section id="about" aria-labelledby="about-heading" className="px-8 py-16 md:px-16 lg:px-24">
      <h2 id="about-heading" className="sr-only">
        About
      </h2>
      <Threshold>
        <div className="mx-auto max-w-4xl space-y-16">
          <div className="space-y-6">
            <BuilderTypewriter prefix={prefix} suffixes={suffixes} sequence={sequence} />
          </div>

          <FactsReveal facts={about.personalFacts} />

          <div>
            <HandwrittenStatement text={about.transitionalStatement} />
          </div>
        </div>
      </Threshold>
    </section>
  );
};
