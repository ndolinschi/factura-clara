"use client";

import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-gradient-to-r from-slate-900 via-emerald-600 to-slate-900 bg-clip-text text-transparent dark:from-slate-100 dark:via-emerald-400 dark:to-slate-100",
        !disabled && "animate-shiny",
        className
      )}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
