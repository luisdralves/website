import Link from "next/link";
import ArrowLeft from "@/components/icons/arrow-left.svg";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 py-16 text-center">
      <p className="font-mono text-accent-cyan/70 text-xs uppercase tracking-[0.3em]">404</p>
      <h1 className="font-bold font-heading text-5xl md:text-7xl">Wrong corridor.</h1>
      <p className="max-w-md font-body text-foreground/70 text-lg leading-relaxed">
        Nothing on this wall. The gallery's that way.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.02] px-6 py-3 font-body text-foreground/80 transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
      >
        <ArrowLeft className="size-4" />
        Back to the entrance
      </Link>
    </main>
  );
}
