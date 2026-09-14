"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { PaymentForm } from "@/components/PaymentForm";
import { StatusChip } from "@/components/StatusChip";
import { ShinyText } from "@/components/ShinyText";
import { t, utilityKindLabel } from "@/lib/i18n";
import { currentMonth, formatMdl, summarizeMonth } from "@/lib/utils";
import type { UtilityKind } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Droplets,
  AlertCircle,
  Plus,
  Receipt,
  Gauge,
} from "lucide-react";

function shiftMonth(monthStr: string, delta: number): string {
  const [yearStr, monthNumStr] = monthStr.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthNumStr, 10) - 1;
  const date = new Date(Date.UTC(year, month + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getUtilityIcon(kind: UtilityKind) {
  switch (kind) {
    case "gas":
      return <Flame className="h-4 w-4 text-amber-500" />;
    case "electricity":
      return <Zap className="h-4 w-4 text-emerald-600" />;
    case "water":
      return <Droplets className="h-4 w-4 text-sky-500" />;
    default:
      return null;
  }
}

export default function DashboardPage() {
  const locale = useAppStore((s) => s.locale);
  const utilities = useAppStore((s) => s.utilities);
  const payments = useAppStore((s) => s.payments);
  const readings = useAppStore((s) => s.readings);
  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const setSelectedMonth = useAppStore((s) => s.setSelectedMonth);
  const seeded = useAppStore((s) => s.seeded);

  const containerRef = useRef<HTMLDivElement>(null);

  const summaries = useMemo(
    () => summarizeMonth(utilities, payments, readings, selectedMonth),
    [utilities, payments, readings, selectedMonth]
  );

  const total = summaries.reduce((a, s) => a + s.paymentsSum, 0);

  const readableMonth = useMemo(() => {
    try {
      const [yearStr, monthNumStr] = (selectedMonth || currentMonth()).split("-");
      const date = new Date(
        Date.UTC(parseInt(yearStr, 10), parseInt(monthNumStr, 10) - 1, 1)
      );
      const formatted = new Intl.DateTimeFormat(
        locale === "ru" ? "ru-MD" : "ro-MD",
        {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }
      ).format(date);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return selectedMonth;
    }
  }, [selectedMonth, locale]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.from(".dashboard-card", {
        opacity: 0,
        y: 16,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: containerRef, dependencies: [selectedMonth, utilities.length] }
  );

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-md border border-slate-800/80">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShinyText text={t(locale, "appTitle")} className="text-white font-extrabold" />
            </h1>
            {seeded && (
              <Badge
                variant="outline"
                className="border-emerald-400/40 bg-emerald-950/60 text-emerald-200 text-xs font-normal"
              >
                {t(locale, "seededNotice")}
              </Badge>
            )}
          </div>
          <p className="mt-1.5 max-w-xl text-sm text-slate-300">
            {t(locale, "tagline")}
          </p>
        </div>
      </div>

      {/* Month Navigation & Summary Card */}
      <Card className="dashboard-card border-slate-200/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t(locale, "month")}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/70 p-0.5 shadow-xs">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-600 hover:text-slate-900"
                  onClick={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}
                  title={locale === "ru" ? "Предыдущий месяц" : "Luna precedentă"}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-2.5 text-sm font-semibold text-slate-800 min-w-[120px] text-center">
                  {readableMonth}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-600 hover:text-slate-900"
                  onClick={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}
                  title={locale === "ru" ? "Следующий месяц" : "Luna următoare"}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <Input
                    type="month"
                    className="h-9 w-[130px] sm:w-[145px] text-xs font-medium"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
                {selectedMonth !== currentMonth() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs font-medium"
                    onClick={() => setSelectedMonth(currentMonth())}
                  >
                    <CalendarDays className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                    {locale === "ru" ? "Текущий" : "Luna curentă"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-baseline sm:items-end justify-between border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t(locale, "totalMonth")}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600">
              {formatMdl(total, locale)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Utilities Grid */}
      {utilities.length === 0 ? (
        <Card className="dashboard-card border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-sm text-slate-600 mb-4">{t(locale, "noUtilities")}</p>
          <Button asChild>
            <Link href="/utilities">{t(locale, "addUtility")}</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((s) => (
            <Card
              key={s.utility.id}
              className="dashboard-card flex flex-col justify-between border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700"
                  >
                    {getUtilityIcon(s.utility.kind)}
                    <span>{utilityKindLabel(locale, s.utility.kind)}</span>
                  </Badge>
                  <StatusChip status={s.status} locale={locale} />
                </div>
                <CardTitle className="mt-2 text-base font-semibold text-slate-900">
                  {s.utility.name}
                </CardTitle>
                {(s.utility.provider || s.utility.accountNumber) && (
                  <CardDescription className="text-xs text-slate-500 truncate">
                    {[s.utility.provider, s.utility.accountNumber]
                      .filter(Boolean)
                      .join(" · ")}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2 rounded-xl bg-slate-50/75 p-3 text-xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Receipt className="h-3.5 w-3.5 text-slate-400" />
                      {t(locale, "paymentsSum")}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatMdl(s.paymentsSum, locale)}
                      <span className="ml-1 text-[11px] font-normal text-slate-400">
                        ({s.paymentCount})
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Gauge className="h-3.5 w-3.5 text-slate-400" />
                      {t(locale, "lastReading")}
                    </span>
                    <span className="font-medium text-slate-700">
                      {s.lastReading
                        ? `${s.lastReading.value} (${s.lastReading.readingDate})`
                        : t(locale, "noReading")}
                    </span>
                  </div>
                </div>

                {s.status === "mismatch" && (
                  <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-rose-200 bg-rose-50/80 p-2 text-xs text-rose-800">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{t(locale, "mismatchHint")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Add Payment */}
      <Card className="dashboard-card border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            {t(locale, "quickAddPayment")}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {locale === "ru"
              ? "Быстро зарегистрируйте платёж за текущую выбранную услугу"
              : "Înregistrează rapid o plată pentru serviciile selectate"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentForm
            compact
            onDone={() => toast.success(t(locale, "paymentAdded"))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
