"use client";

import { statusLabel } from "@/lib/i18n";
import type { Locale, MonthStatus } from "@/lib/types";

const styles: Record<MonthStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  partial: "bg-amber-100 text-amber-900 ring-amber-200",
  missing: "bg-slate-100 text-slate-700 ring-slate-200",
  mismatch: "bg-rose-100 text-rose-800 ring-rose-200",
};

export function StatusChip({
  status,
  locale,
}: {
  status: MonthStatus;
  locale: Locale;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {statusLabel(locale, status)}
    </span>
  );
}
