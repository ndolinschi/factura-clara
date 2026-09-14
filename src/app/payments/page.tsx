"use client";

import { useMemo, useRef, useState } from "react";
import { PaymentForm } from "@/components/PaymentForm";
import { t } from "@/lib/i18n";
import { formatMdl, parseCsvPayments } from "@/lib/utils";
import type { Payment, UtilityKind } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Upload,
  Trash2,
  FileText,
  Plus,
  Receipt,
  Flame,
  Zap,
  Droplets,
  Filter,
} from "lucide-react";

function getUtilityIcon(kind: UtilityKind) {
  switch (kind) {
    case "gas":
      return <Flame className="h-3.5 w-3.5 text-amber-500" />;
    case "electricity":
      return <Zap className="h-3.5 w-3.5 text-emerald-600" />;
    case "water":
      return <Droplets className="h-3.5 w-3.5 text-sky-500" />;
    default:
      return null;
  }
}

export default function PaymentsPage() {
  const locale = useAppStore((s) => s.locale);
  const utilities = useAppStore((s) => s.utilities);
  const payments = useAppStore((s) => s.payments);
  const deletePayment = useAppStore((s) => s.deletePayment);
  const importPayments = useAppStore((s) => s.importPayments);

  const fileRef = useRef<HTMLInputElement>(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  const filtered = useMemo(() => {
    const list = filterMonth
      ? payments.filter((p) => p.billingMonth === filterMonth)
      : payments;
    return list.slice().sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  }, [payments, filterMonth]);

  async function onCsv(file: File) {
    try {
      const text = await file.text();
      const rows = parseCsvPayments(text, utilities);
      if (rows.length === 0) {
        toast.error(t(locale, "importError"));
        return;
      }
      importPayments(rows);
      toast.success(`${t(locale, "importSuccess")} (${rows.length})`);
    } catch {
      toast.error(t(locale, "importError"));
    }
  }

  function confirmDeletePayment() {
    if (!paymentToDelete) return;
    deletePayment(paymentToDelete.id);
    toast.success(t(locale, "delete"));
    setPaymentToDelete(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t(locale, "navPayments")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t(locale, "allPayments")}</p>
      </div>

      {/* Add Payment Form */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600" />
            {t(locale, "addPayment")}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {locale === "ru"
              ? "Зарегистрируйте новую оплату с указанием месяца и суммы в леях"
              : "Înregistrează o plată nouă cu luna facturată și suma în MDL"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentForm onDone={() => toast.success(t(locale, "paymentAdded"))} />
        </CardContent>
      </Card>

      {/* CSV Import */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-600" />
            {t(locale, "importCsv")}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {locale === "ru"
              ? "Массовый импорт платежей из таблицы CSV"
              : "Importă plăți în masă dintr-un fișier CSV"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/75 p-3 text-xs text-slate-600 space-y-1">
            <p className="font-medium text-slate-700">{t(locale, "csvHint")}</p>
            <p className="text-slate-500">{t(locale, "csvUtilityHint")}</p>
          </div>

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

          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t(locale, "importCsv")}
          </Button>
        </CardContent>
      </Card>

      {/* Payments Ledger Table */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-emerald-600" />
              {t(locale, "allPayments")}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {filtered.length}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              <span>{t(locale, "filterMonth")}:</span>
            </div>
            <Input
              type="month"
              className="h-8 w-[140px] text-xs"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
            {filterMonth && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-slate-500 hover:text-slate-900"
                onClick={() => setFilterMonth("")}
              >
                {t(locale, "allMonths")}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              {t(locale, "emptyLedger")}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200/80">
              <table className="min-w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">{t(locale, "paidAt")}</th>
                    <th className="py-3 px-4">{t(locale, "utility")}</th>
                    <th className="py-3 px-4">{t(locale, "billingMonth")}</th>
                    <th className="py-3 px-4">{t(locale, "amount")}</th>
                    <th className="py-3 px-4">{t(locale, "note")}</th>
                    <th className="py-3 px-4 text-right">{t(locale, "actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((p) => {
                    const u = utilities.find((x) => x.id === p.utilityId);
                    return (
                      <tr
                        key={p.id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="py-3 px-4 font-mono text-xs whitespace-nowrap text-slate-600">
                          {p.paidAt}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-slate-900">
                            {u && getUtilityIcon(u.kind)}
                            <span>{u?.name ?? p.utilityId}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            {p.billingMonth}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {formatMdl(p.amountMdl, locale)}
                        </td>
                        <td className="py-3 px-4 max-w-[14rem] text-slate-600 truncate">
                          {p.note ? (
                            <span title={p.note}>{p.note}</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                          {p.receiptFilename && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-[11px] text-slate-400">
                              <FileText className="h-3 w-3" />
                              {p.receiptFilename}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-rose-600"
                            onClick={() => setPaymentToDelete(p)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t(locale, "delete")}</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Payment Confirmation Dialog */}
      <Dialog
        open={paymentToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPaymentToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(locale, "delete")}</DialogTitle>
            <DialogDescription>
              {locale === "ru"
                ? `Удалить платёж на сумму ${
                    paymentToDelete ? formatMdl(paymentToDelete.amountMdl, locale) : ""
                  } от ${paymentToDelete?.paidAt}?`
                : `Ștergi plata în valoare de ${
                    paymentToDelete ? formatMdl(paymentToDelete.amountMdl, locale) : ""
                  } din ${paymentToDelete?.paidAt}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => setPaymentToDelete(null)}
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={confirmDeletePayment}
            >
              {t(locale, "delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
