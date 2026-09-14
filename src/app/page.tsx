"use client";

import { useMemo } from "react";
import { PaymentForm } from "@/components/PaymentForm";
import { StatusChip } from "@/components/StatusChip";
import { t, utilityKindLabel } from "@/lib/i18n";
import { formatMdl, summarizeMonth } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardPage() {
  const locale = useAppStore((s) => s.locale);
  const utilities = useAppStore((s) => s.utilities);
  const payments = useAppStore((s) => s.payments);
  const readings = useAppStore((s) => s.readings);
  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const setSelectedMonth = useAppStore((s) => s.setSelectedMonth);
  const seeded = useAppStore((s) => s.seeded);

  const summaries = useMemo(
    () => summarizeMonth(utilities, payments, readings, selectedMonth),
    [utilities, payments, readings, selectedMonth]
  );

  const total = summaries.reduce((a, s) => a + s.paymentsSum, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight">
          {t(locale, "appTitle")}
        </h1>
        <p className="mt-1 max-w-xl text-sm text-emerald-50">
          {t(locale, "tagline")}
        </p>
        {seeded && (
          <p className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs">
            {t(locale, "seededNotice")}
          </p>
        )}
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            {t(locale, "month")}
          </span>
          <input
            type="month"
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </label>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            {t(locale, "totalMonth")}
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {formatMdl(total, locale)}
          </div>
        </div>
      </section>

      {utilities.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          {t(locale, "noUtilities")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((s) => (
            <article
              key={s.utility.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {utilityKindLabel(locale, s.utility.kind)}
                  </div>
                  <h2 className="font-semibold text-slate-900">
                    {s.utility.name}
                  </h2>
                  {s.utility.provider && (
                    <p className="text-xs text-slate-500">
                      {s.utility.provider}
                    </p>
                  )}
                </div>
                <StatusChip status={s.status} locale={locale} />
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t(locale, "paymentsSum")}</dt>
                  <dd className="font-medium">
                    {formatMdl(s.paymentsSum, locale)}
                    <span className="ml-1 text-xs text-slate-400">
                      ({s.paymentCount})
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{t(locale, "lastReading")}</dt>
                  <dd className="font-medium">
                    {s.lastReading
                      ? `${s.lastReading.value} (${s.lastReading.readingDate})`
                      : t(locale, "noReading")}
                  </dd>
                </div>
              </dl>
              {s.status === "mismatch" && (
                <p className="mt-3 text-xs text-rose-700">
                  {t(locale, "mismatchHint")}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          {t(locale, "quickAddPayment")}
        </h2>
        <PaymentForm compact />
      </section>
    </div>
  );
}
