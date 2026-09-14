"use client";

import { useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { downloadBlob, validateImport } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export default function SettingsPage() {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);
  const resetData = useAppStore((s) => s.resetData);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function onExport() {
    const data = exportData();
    downloadBlob(
      `factura-clara-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(data, null, 2),
      "application/json"
    );
  }

  async function onImport(file: File) {
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      if (!validateImport(parsed)) {
        setMsg(t(locale, "importError"));
        return;
      }
      importData(parsed);
      setMsg(t(locale, "importSuccess"));
    } catch {
      setMsg(t(locale, "importError"));
    }
  }

  function onReset() {
    if (window.confirm(t(locale, "resetConfirm"))) {
      resetData();
      setMsg(t(locale, "importSuccess"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t(locale, "settingsTitle")}
        </h1>
        <p className="text-sm text-slate-500">{t(locale, "about")}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">{t(locale, "language")}</h2>
        <div className="flex gap-2">
          {(["ro", "ru"] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                locale === l
                  ? "bg-slate-900 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">{t(locale, "dataSection")}</h2>
        <p className="mb-4 text-sm text-slate-500">{t(locale, "backupHint")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExport}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {t(locale, "exportJson")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImport(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            {t(locale, "importJson")}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
          >
            {t(locale, "resetData")}
          </button>
        </div>
        {msg && <p className="mt-3 text-sm text-emerald-700">{msg}</p>}
      </section>
    </div>
  );
}
