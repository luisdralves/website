import { About } from "@/app/sections/about";
import { Landing } from "@/app/sections/landing";
import { Photography } from "@/app/sections/photography";
import { Projects } from "@/app/sections/projects";
import { ScrollProgressIndicator } from "@/components/scroll-progress-indicator";

export default function Home() {
  return (
    <>
      <ScrollProgressIndicator />

      <main>
        <Landing />

        <About />

        <Projects />

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
