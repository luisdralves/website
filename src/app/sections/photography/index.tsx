import { PhotographyClient } from "./photography-client";
import { VoiceCta } from "./voice-cta";

export const Photography = () => {
  const apiUrl = process.env.RATE_MY_SHOTS_URL;
  if (!apiUrl) throw new Error("Missing required env var: RATE_MY_SHOTS_URL");

  return (
    <section id="photography" className="min-h-screen px-8 py-16 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="space-y-8">
          <h2 className="font-bold font-heading text-5xl md:text-7xl">Photography</h2>
          <p className="max-w-2xl font-body text-xl leading-relaxed md:text-2xl">
            Moments captured through the lens.
          </p>
          <VoiceCta url={apiUrl} />
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-480">
        <PhotographyClient apiUrl={apiUrl} />
        <noscript>
          <p className="text-center font-body text-foreground/60">This one really needs JS.</p>
        </noscript>
      </div>
    </section>
  );
};
