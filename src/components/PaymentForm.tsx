"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import { currentMonth, todayISO } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export function PaymentForm({
  onDone,
  compact,
}: {
  onDone?: () => void;
  compact?: boolean;
}) {
  const locale = useAppStore((s) => s.locale);
  const utilities = useAppStore((s) => s.utilities);
  const addPayment = useAppStore((s) => s.addPayment);
  const selectedMonth = useAppStore((s) => s.selectedMonth);

  const [utilityId, setUtilityId] = useState(utilities[0]?.id ?? "");
  const [amountMdl, setAmountMdl] = useState("");
  const [paidAt, setPaidAt] = useState(todayISO());
  const [billingMonth, setBillingMonth] = useState(
    selectedMonth || currentMonth()
  );
  const [note, setNote] = useState("");
  const [receiptFilename, setReceiptFilename] = useState("");

  if (utilities.length === 0) {
    return (
      <p className="text-sm text-slate-500">{t(locale, "noUtilities")}</p>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(amountMdl);
    if (!utilityId || !Number.isFinite(amount) || amount < 0) return;
    addPayment({
      utilityId,
      amountMdl: amount,
      paidAt,
      billingMonth,
      note: note || undefined,
      receiptFilename: receiptFilename || undefined,
    });
    setAmountMdl("");
    setNote("");
    setReceiptFilename("");
    onDone?.();
  }

  return (
    <form
      onSubmit={submit}
      className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          {t(locale, "utility")}
        </span>
        <select
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
          value={utilityId || utilities[0].id}
          onChange={(e) => setUtilityId(e.target.value)}
          required
        >
          {utilities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          {t(locale, "amount")}
        </span>
        <input
          type="number"
          step="0.01"
          min="0"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={amountMdl}
          onChange={(e) => setAmountMdl(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          {t(locale, "paidAt")}
        </span>
        <input
          type="date"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          {t(locale, "billingMonth")}
        </span>
        <input
          type="month"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={billingMonth}
          onChange={(e) => setBillingMonth(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="mb-1 block font-medium text-slate-700">
          {t(locale, "note")}
        </span>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="mismatch / partial / …"
        />
      </label>
      {!compact && (
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-slate-700">
            {t(locale, "receipt")}
          </span>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={receiptFilename}
            onChange={(e) => setReceiptFilename(e.target.value)}
          />
        </label>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {t(locale, "addPayment")}
        </button>
      </div>
    </form>
  );
}
