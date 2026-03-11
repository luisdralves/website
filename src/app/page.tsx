import { About } from "@/app/sections/about";
import { Landing } from "@/app/sections/landing";
import { Photography } from "@/app/sections/photography";
import { MagneticHoverShowcase } from "@/components/magnetic-hover-showcase";
import { ScrollProgressIndicator } from "@/components/scroll-progress-indicator";

export default function Home() {
  return (
    <>
      <ScrollProgressIndicator />

      <main>
        <Landing />

        <About />

        <section id="projects" className="min-h-screen px-8 py-16 md:px-16 lg:px-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <div className="space-y-8">
              <h2 className="font-bold font-heading text-5xl md:text-7xl">Projects</h2>
              <p className="font-body text-xl leading-relaxed md:text-2xl">
                Interactive showcase of the magnetic spring hover effect from Story 1.5.
              </p>
            </div>

            <MagneticHoverShowcase />
          </div>
        </section>

        <section id="travel" className="min-h-[200vh] px-8 py-16 md:px-16 lg:px-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <div className="space-y-8">
              <h2 className="font-bold font-heading text-5xl md:text-7xl">Travel</h2>
              <p className="font-body text-xl leading-relaxed md:text-2xl">
                This section is intentionally very tall to simulate the 3D passport experience that
                will be built in Epic 5. The scroll indicator correctly tracks position regardless
                of section height.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`travel-card-${i + 1}`}
                  className="flex aspect-video items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5"
                >
                  <span className="font-heading text-2xl opacity-40">Travel Card {i + 1}</span>
                </div>
              ))}
            </div>

            <div className="py-32 text-center">
              <p className="font-cursive text-4xl text-accent-violet">The journey continues...</p>
            </div>
          </div>
        </section>

        <Photography />

        <section
          id="footer"
          className="flex min-h-[50vh] items-center px-8 py-16 md:px-16 lg:px-24"
        >
          <div className="mx-auto w-full max-w-4xl space-y-8 text-center">
            <h2 className="font-bold font-heading text-4xl md:text-6xl">End of Journey</h2>
            <p className="font-body text-lg opacity-80 md:text-xl">
              The footer section is intentionally short to demonstrate that the scroll indicator
              handles varying section heights correctly.
            </p>
            <div className="flex justify-center gap-6">
              <span className="text-accent-cyan">GitHub</span>
              <span className="text-accent-violet">LinkedIn</span>
              <span className="text-foreground/60">Email</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
