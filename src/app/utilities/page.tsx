"use client";

import { useState } from "react";
import { t, utilityKindLabel } from "@/lib/i18n";
import type { UtilityKind } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

export default function UtilitiesPage() {
  const locale = useAppStore((s) => s.locale);
  const utilities = useAppStore((s) => s.utilities);
  const readings = useAppStore((s) => s.readings);
  const addUtility = useAppStore((s) => s.addUtility);
  const deleteUtility = useAppStore((s) => s.deleteUtility);
  const addReading = useAppStore((s) => s.addReading);
  const deleteReading = useAppStore((s) => s.deleteReading);

  const [kind, setKind] = useState<UtilityKind>("gas");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [readingUtilityId, setReadingUtilityId] = useState("");
  const [readingValue, setReadingValue] = useState("");
  const [readingDate, setReadingDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  function submitUtility(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addUtility({
      kind,
      name: name.trim(),
      provider: provider.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
    });
    setName("");
    setProvider("");
    setAccountNumber("");
  }

  function submitReading(e: React.FormEvent) {
    e.preventDefault();
    const utilId = readingUtilityId || utilities[0]?.id;
    const value = Number(readingValue);
    if (!utilId || !Number.isFinite(value)) return;
    addReading({ utilityId: utilId, value, readingDate });
    setReadingValue("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t(locale, "navUtilities")}
        </h1>
        <p className="text-sm text-slate-500">{t(locale, "manageUtilities")}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">{t(locale, "addUtility")}</h2>
        <form onSubmit={submitUtility} className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t(locale, "kind")}</span>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={kind}
              onChange={(e) => setKind(e.target.value as UtilityKind)}
            >
              <option value="gas">{t(locale, "gas")}</option>
              <option value="electricity">{t(locale, "electricity")}</option>
              <option value="water">{t(locale, "water")}</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">{t(locale, "name")}</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              {t(locale, "provider")}
            </span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              {t(locale, "accountNumber")}
            </span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              {t(locale, "save")}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        {utilities.length === 0 && (
          <p className="text-slate-500">{t(locale, "noUtilities")}</p>
        )}
        {utilities.map((u) => (
          <article
            key={u.id}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-xs uppercase text-slate-500">
                {utilityKindLabel(locale, u.kind)}
              </div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-slate-500">
                {[u.provider, u.accountNumber].filter(Boolean).join(" · ") ||
                  "—"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => deleteUtility(u.id)}
              className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50"
            >
              {t(locale, "delete")}
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">{t(locale, "readings")}</h2>
        {utilities.length > 0 && (
          <form onSubmit={submitReading} className="mb-4 grid gap-3 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">
                {t(locale, "utility")}
              </span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={readingUtilityId || utilities[0].id}
                onChange={(e) => setReadingUtilityId(e.target.value)}
              >
                {utilities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">
                {t(locale, "readingValue")}
              </span>
              <input
                type="number"
                step="any"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={readingValue}
                onChange={(e) => setReadingValue(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">
                {t(locale, "readingDate")}
              </span>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={readingDate}
                onChange={(e) => setReadingDate(e.target.value)}
                required
              />
            </label>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {t(locale, "addReading")}
              </button>
            </div>
          </form>
        )}
        <ul className="divide-y divide-slate-100">
          {readings
            .slice()
            .sort((a, b) => b.readingDate.localeCompare(a.readingDate))
            .map((r) => {
              const u = utilities.find((x) => x.id === r.utilityId);
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 py-2 text-sm"
                >
                  <span>
                    <strong>{u?.name ?? r.utilityId}</strong>: {r.value} ·{" "}
                    {r.readingDate}
                  </span>
                  <button
                    type="button"
                    className="text-rose-600 hover:underline"
                    onClick={() => deleteReading(r.id)}
                  >
                    {t(locale, "delete")}
                  </button>
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
}
