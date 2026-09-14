"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import { currentMonth, todayISO } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      className={`grid gap-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}
    >
      <div className="space-y-2">
        <Label htmlFor="utility">{t(locale, "utility")}</Label>
        <Select
          value={utilityId || utilities[0].id}
          onValueChange={setUtilityId}
          required
        >
          <SelectTrigger id="utility">
            <SelectValue placeholder={t(locale, "utility")} />
          </SelectTrigger>
          <SelectContent>
            {utilities.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">{t(locale, "amount")}</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amountMdl}
          onChange={(e) => setAmountMdl(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paidAt">{t(locale, "paidAt")}</Label>
        <Input
          id="paidAt"
          type="date"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="billingMonth">{t(locale, "billingMonth")}</Label>
        <Input
          id="billingMonth"
          type="month"
          value={billingMonth}
          onChange={(e) => setBillingMonth(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="note">{t(locale, "note")}</Label>
        <Input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="mismatch / partial / …"
        />
      </div>
      {!compact && (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="receipt">{t(locale, "receipt")}</Label>
          <Input
            id="receipt"
            type="text"
            value={receiptFilename}
            onChange={(e) => setReceiptFilename(e.target.value)}
          />
        </div>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" className="w-full sm:w-auto">
          {t(locale, "addPayment")}
        </Button>
      </div>
    </form>
  );
}
