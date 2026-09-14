"use client";

import { useMemo, useRef, useState } from "react";
import { PaymentForm } from "@/components/PaymentForm";
import { t } from "@/lib/i18n";
import { formatMdl, parseCsvPayments } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export default function PaymentsPage() {
  const locale = useAppStore((s) => s.locale);
  const utilities = useAppStore((s) => s.utilities);
  const payments = useAppStore((s) => s.payments);
  const deletePayment = useAppStore((s) => s.deletePayment);
  const importPayments = useAppStore((s) => s.importPayments);
  const fileRef = useRef<HTMLInputElement>(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = filterMonth
      ? payments.filter((p) => p.billingMonth === filterMonth)
      : payments;
    return list
      .slice()
      .sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  }, [payments, filterMonth]);

  async function onCsv(file: File) {
    try {
      const text = await file.text();
      const rows = parseCsvPayments(text, utilities);
      if (rows.length === 0) {
        setMsg(t(locale, "importError"));
        return;
      }
      importPayments(rows);
      setMsg(`${t(locale, "importSuccess")} (${rows.length})`);
    } catch {
      setMsg(t(locale, "importError"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t(locale, "navPayments")}
        </h1>
        <p className="text-sm text-slate-500">{t(locale, "allPayments")}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">{t(locale, "addPayment")}</h2>
        <PaymentForm />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">{t(locale, "importCsv")}</h2>
        <p className="mb-1 text-xs text-slate-500">{t(locale, "csvHint")}</p>
        <p className="mb-3 text-xs text-slate-500">
          {t(locale, "csvUtilityHint")}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onCsv(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          onClick={() => fileRef.current?.click()}
        >
          {t(locale, "importCsv")}
        </button>
        {msg && <p className="mt-2 text-sm text-emerald-700">{msg}</p>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">{t(locale, "allPayments")}</h2>
          <label className="flex items-center gap-2 text-sm">
            <span>{t(locale, "filterMonth")}</span>
            <input
              type="month"
              className="rounded-lg border border-slate-300 px-2 py-1"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
            {filterMonth && (
              <button
                type="button"
                className="text-xs text-slate-500 underline"
                onClick={() => setFilterMonth("")}
              >
                {t(locale, "allMonths")}
              </button>
            )}
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">{t(locale, "emptyLedger")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">{t(locale, "paidAt")}</th>
                  <th className="py-2 pr-3">{t(locale, "utility")}</th>
                  <th className="py-2 pr-3">{t(locale, "billingMonth")}</th>
                  <th className="py-2 pr-3">{t(locale, "amount")}</th>
                  <th className="py-2 pr-3">{t(locale, "note")}</th>
                  <th className="py-2">{t(locale, "actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const u = utilities.find((x) => x.id === p.utilityId);
                  return (
                    <tr key={p.id} className="border-b border-slate-100">
                      <td className="py-2 pr-3 whitespace-nowrap">{p.paidAt}</td>
                      <td className="py-2 pr-3">{u?.name ?? p.utilityId}</td>
                      <td className="py-2 pr-3">{p.billingMonth}</td>
                      <td className="py-2 pr-3 font-medium">
                        {formatMdl(p.amountMdl, locale)}
                      </td>
                      <td className="py-2 pr-3 max-w-[12rem] truncate text-slate-600">
                        {p.note || "—"}
                      </td>
                      <td className="py-2">
                        <button
                          type="button"
                          className="text-rose-600 hover:underline"
                          onClick={() => deletePayment(p.id)}
                        >
                          {t(locale, "delete")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
