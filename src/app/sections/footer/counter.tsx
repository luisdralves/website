"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { footer } from "@/content/footer";
import { DigitDisplay } from "./digit-display";

const BURST_WINDOW_MS = 16000;
const BURST_THRESHOLD = 3;

type CounterResponse = { count: number };

const fetcher = async (url: string): Promise<CounterResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Counter fetch failed: ${res.status}`);
  return res.json();
};

export const Counter = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickTimestampsRef = useRef<number[]>([]);

  const { data, mutate } = useSWR<CounterResponse>("/api/counter", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (data?.count !== undefined) setCount(data.count);
  }, [data?.count]);

  useEffect(
    () => () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    },
    [],
  );

  const showMessage = (text: string) => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage(text);
    messageTimerRef.current = setTimeout(() => setMessage(null), 3000);
  };

  const handleClick = async () => {
    if (busy) return;

    const now = Date.now();
    const recent = clickTimestampsRef.current.filter((t) => now - t < BURST_WINDOW_MS);
    recent.push(now);
    clickTimestampsRef.current = recent;

    setBusy(true);
    try {
      const res = await fetch("/api/counter", { method: "POST" });
      const body = (await res.json()) as { count?: number; error?: string };
      if (res.ok && typeof body.count === "number") {
        mutate({ count: body.count }, { revalidate: false });
        if (recent.length >= BURST_THRESHOLD) {
          showMessage(footer.excessClickMessage);
        }
      } else {
        showMessage(body.error ?? footer.errorMessage);
      }
    } catch {
      showMessage(footer.errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-3">
        <span className="font-body text-foreground/70">{footer.totalVisitsLabel}</span>
        <span className="font-mono text-3xl text-foreground">
          <DigitDisplay value={count} />
        </span>
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          aria-label="Increment visitor counter"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-foreground/20 bg-foreground/2 font-mono text-foreground transition-colors hover:border-accent-cyan/60 hover:text-accent-cyan disabled:cursor-wait"
        >
          +
        </button>
      </div>
      <p className="max-w-sm font-body text-foreground/60 text-sm">{footer.counterPrompt}</p>
      <p aria-live="polite" className="h-5 font-body text-accent-cyan text-sm">
        {message}
      </p>
    </div>
  );
};
