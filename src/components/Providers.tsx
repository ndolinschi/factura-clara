"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrated = useAppStore((s) => s.hydrated);
  const ensureSeed = useAppStore((s) => s.ensureSeed);
  const setHydrated = useAppStore((s) => s.setHydrated);

  useEffect(() => {
    // Fallback if persist rehydration already finished before subscribe
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
      ensureSeed();
    }
    const unsub = useAppStore.persist.onFinishHydration(() => {
      setHydrated(true);
      ensureSeed();
    });
    return unsub;
  }, [ensureSeed, setHydrated]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-slate-500">
        Se încarcă…
      </div>
    );
  }

  return <>{children}</>;
}
