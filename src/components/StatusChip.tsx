"use client";

import { statusLabel } from "@/lib/i18n";
import type { Locale, MonthStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const variantStyles: Record<MonthStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200",
  partial: "bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-200",
  missing: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200",
  mismatch: "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200",
};

export function StatusChip({
  status,
  locale,
}: {
  status: MonthStatus;
  locale: Locale;
}) {
  return (
    <Badge variant="outline" className={variantStyles[status]}>
      {statusLabel(locale, status)}
    </Badge>
  );
}
