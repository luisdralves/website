import { Landing } from "@/app/sections/landing";
import { MagneticHoverShowcase } from "@/components/magnetic-hover-showcase";
import { ScrollProgressIndicator } from "@/components/scroll-progress-indicator";

export default function Home() {
  return (
    <>
      <ScrollProgressIndicator />

      <main>
        <Landing />

        <section id="about" className="px-8 py-16 md:px-16 lg:px-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <div className="space-y-8">
              <h2 className="font-bold font-heading text-5xl md:text-7xl">About</h2>
              <p className="font-body text-xl leading-relaxed md:text-2xl">
                This is Outfit, the body font. It&apos;s clean, modern, and highly readable across
                all sizes. The neo-noir palette creates a cinematic feel with warm off-white text on
                deep dark blue-grey.
              </p>
              <p className="font-cursive text-3xl md:text-4xl">
                And this is Caveat, for handwritten notes and journal entries...
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-heading font-semibold text-3xl">Color Palette</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="h-24 rounded-lg border border-foreground/20 bg-background" />
                  <p className="font-body text-sm">Background</p>
                  <code className="text-xs opacity-60">oklch(0.16 0.02 255)</code>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-foreground" />
                  <p className="font-body text-sm">Foreground</p>
                  <code className="text-xs opacity-60">oklch(0.94 0.02 90)</code>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-accent-cyan" />
                  <p className="font-body text-sm">Accent Cyan</p>
                  <code className="text-xs opacity-60">oklch(0.75 0.14 195)</code>
                </div>
                <div className="space-y-2">
                  <div className="h-24 rounded-lg bg-accent-violet" />
                  <p className="font-body text-sm">Accent Violet</p>
                  <code className="text-xs opacity-60">oklch(0.58 0.19 300)</code>
                </div>
              </div>
            </div>

            <blockquote className="border-accent-cyan border-l-4 pl-6 italic">
              <p className="font-body text-xl">
                &quot;Motion is the medium. Animation is not decoration, it&apos;s the point.&quot;
              </p>
            </blockquote>
          </div>
        </section>

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

        <section id="photography" className="min-h-[120vh] px-8 py-16 md:px-16 lg:px-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <div className="space-y-8">
              <h2 className="font-bold font-heading text-5xl md:text-7xl">Photography</h2>
              <p className="font-body text-xl leading-relaxed md:text-2xl">
                A masonry gallery will be implemented here in Epic 6, featuring integration with
                Immich for photo management.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={`photo-placeholder-${i + 1}`}
                  className={`flex items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 ${
                    i % 3 === 0 ? "aspect-3/4" : i % 3 === 1 ? "aspect-square" : "aspect-4/3"
                  }`}
                >
                  <span className="font-body text-sm opacity-40">Photo {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

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
