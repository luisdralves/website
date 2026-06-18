import { About } from "@/app/sections/about";
import { Footer } from "@/app/sections/footer";
import { Landing } from "@/app/sections/landing";
import { Photography } from "@/app/sections/photography";
import { Projects } from "@/app/sections/projects";
import { ScrollProgressIndicator } from "@/components/scroll-progress-indicator";

export default function Home() {
  return (
    <>
      <ScrollProgressIndicator />

      <main id="main-content">
        <Landing />

        <About />

        <Projects />

        <Photography />
      </main>

      <Footer />
    </>
  );
}
