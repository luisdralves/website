import { MagneticHoverShowcase } from "@/components/magnetic-hover-showcase";

export default function Home() {
  return (
    <main className="min-h-screen px-8 py-16 md:px-16 lg:px-24">
      <section className="mx-auto max-w-4xl space-y-16">
        <div className="space-y-8">
          <h1 className="font-bold font-heading text-5xl md:text-7xl">Space Grotesk</h1>
          <p className="font-body text-xl leading-relaxed md:text-2xl">
            This is Outfit, the body font. It&apos;s clean, modern, and highly readable across all
            sizes. The neo-noir palette creates a cinematic feel with warm off-white text on deep
            dark blue-grey.
          </p>
          <p className="font-cursive text-3xl md:text-4xl">
            And this is Caveat, for handwritten notes and journal entries...
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading font-semibold text-3xl">Color Palette</h2>
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

        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-3xl">Accent Colors in Use</h2>
          <p className="text-xl">
            Links and highlights use{" "}
            <span className="text-accent-cyan">cyan for primary actions</span> and{" "}
            <span className="text-accent-violet">violet for secondary emphasis</span>.
          </p>
        </div>

        <MagneticHoverShowcase />
      </section>
    </main>
  );
}
