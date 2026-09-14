"use client";

import { useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { downloadBlob, validateImport } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Globe,
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);
  const resetData = useAppStore((s) => s.resetData);

  const fileRef = useRef<HTMLInputElement>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  function handleLocaleChange(newLocale: Locale) {
    setLocale(newLocale);
    toast.success(
      newLocale === "ro"
        ? "Limba a fost schimbată: Română"
        : "Язык переключён: Русский"
    );
  }

  function onExport() {
    const data = exportData();
    downloadBlob(
      `factura-clara-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(data, null, 2),
      "application/json"
    );
    toast.success(
      locale === "ru" ? "Резервная копия экспортирована" : "Backup exportat cu succes"
    );
  }

  async function onImport(file: File) {
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      if (!validateImport(parsed)) {
        toast.error(t(locale, "importError"));
        return;
      }
      importData(parsed);
      toast.success(t(locale, "importSuccess"));
    } catch {
      toast.error(t(locale, "importError"));
    }
  }

  function handleResetConfirm() {
    resetData();
    setResetDialogOpen(false);
    toast.success(
      locale === "ru"
        ? "Данные сброшены к начальным значениям"
        : "Datele au fost resetate la valorile demo"
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t(locale, "settingsTitle")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t(locale, "about")}</p>
      </div>

      {/* Language Section */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            {t(locale, "language")}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {locale === "ru"
              ? "Выберите язык интерфейса приложения"
              : "Selectează limba pentru interfața aplicației"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(
              [
                { id: "ro" as const, label: "Română" },
                { id: "ru" as const, label: "Русский" },
              ]
            ).map((l) => (
              <Button
                key={l.id}
                type="button"
                variant={locale === l.id ? "default" : "outline"}
                onClick={() => handleLocaleChange(l.id)}
                className="min-w-[100px]"
              >
                {locale === l.id && <Check className="mr-1.5 h-4 w-4" />}
                {l.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Section */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-600" />
            {t(locale, "dataSection")}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {t(locale, "backupHint")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2.5">
            <Button type="button" variant="default" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              {t(locale, "exportJson")}
            </Button>

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

            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {t(locale, "importJson")}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              onClick={() => setResetDialogOpen(true)}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t(locale, "resetData")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Architecture Note */}
      <Card className="border-slate-200/80 bg-slate-50/50 shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {locale === "ru" ? "Конфиденциальность и хранение" : "Confidențialitate și stocare"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-500 leading-relaxed">
          {locale === "ru"
            ? "Все ваши счета, показания и платежи хранятся исключительно в вашем браузере (localStorage). Никакие личные данные не отправляются на сервер. Вы можете создать резервную копию JSON в любой момент."
            : "Toate facturile, citirile și plățile tale sunt stocate exclusiv în browserul tău (localStorage). Nicio dată personală nu este transmisă către servere externe. Poți descărca oricând o copie de rezervă JSON."}
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(locale, "resetData")}</DialogTitle>
            <DialogDescription>
              {t(locale, "resetConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => setResetDialogOpen(false)}
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleResetConfirm}
            >
              {t(locale, "resetData")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
