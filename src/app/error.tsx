"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 py-16 text-center">
      <p className="font-mono text-accent-cyan/70 text-xs uppercase tracking-[0.3em]">500</p>
      <h1 className="font-bold font-heading text-5xl md:text-7xl">A wire came loose.</h1>
      <p className="max-w-md font-body text-foreground/70 text-lg leading-relaxed">
        Something gave out on this page. Try again, it might catch.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.02] px-6 py-3 font-body text-foreground/80 transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
      >
        Try again
      </button>
    </main>
  );
}
