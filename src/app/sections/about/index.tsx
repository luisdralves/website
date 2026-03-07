import { about } from "@/content/about";
import { BuilderTypewriter } from "./builder-typewriter";
import { generateKeySequence } from "./builder-typewriter/sequence";

export const About = () => {
  const { prefix, suffixes } = about.builderPhrase;
  const sequence = generateKeySequence(prefix, suffixes);

  return (
    <section id="about" className="px-8 py-16 md:px-16 lg:px-24">
      <div className="mx-auto max-w-4xl space-y-16">
        <div className="space-y-6">
          <BuilderTypewriter prefix={prefix} suffixes={suffixes} sequence={sequence} />
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {about.personalFacts.map((fact) => (
              <div key={fact.label} className="space-y-1">
                <p className="font-body text-sm uppercase tracking-wider opacity-60">
                  {fact.label}
                </p>
                <p className="font-body text-lg">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-cursive text-3xl text-accent-cyan md:text-4xl">
            {about.transitionalStatement}
          </p>
        </div>
      </div>
    </section>
  );
};
