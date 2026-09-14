"use client";

import { useState } from "react";
import { t, utilityKindLabel } from "@/lib/i18n";
import type { UtilityAccount, UtilityKind, MeterReading } from "@/lib/types";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Flame, Zap, Droplets, Trash2, Plus, Gauge, Calendar } from "lucide-react";

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

  const [utilityToDelete, setUtilityToDelete] = useState<UtilityAccount | null>(null);
  const [readingToDelete, setReadingToDelete] = useState<MeterReading | null>(null);

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
    toast.success(t(locale, "utilityAdded"));
  }

  function submitReading(e: React.FormEvent) {
    e.preventDefault();
    const utilId = readingUtilityId || utilities[0]?.id;
    const value = Number(readingValue);
    if (!utilId || !Number.isFinite(value)) return;
    addReading({ utilityId: utilId, value, readingDate });
    setReadingValue("");
    toast.success(t(locale, "addReading"));
  }

  function confirmDeleteUtility() {
    if (!utilityToDelete) return;
    deleteUtility(utilityToDelete.id);
    toast.success(t(locale, "delete"));
    setUtilityToDelete(null);
  }

  function confirmDeleteReading() {
    if (!readingToDelete) return;
    deleteReading(readingToDelete.id);
    toast.success(t(locale, "delete"));
    setReadingToDelete(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t(locale, "navUtilities")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "manageUtilities")}
        </p>
      </div>

      {/* Add Utility Form */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600" />
            {t(locale, "addUtility")}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {locale === "ru"
              ? "Создайте аккаунт для отслеживания газа, электроэнергии или воды"
              : "Creează un cont pentru evidența gazului, curentului electric sau apei"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitUtility} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="utility-kind">{t(locale, "kind")}</Label>
              <Select
                value={kind}
                onValueChange={(val) => setKind(val as UtilityKind)}
              >
                <SelectTrigger id="utility-kind">
                  <SelectValue placeholder={t(locale, "kind")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gas">
                    <span className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-amber-500" />
                      {t(locale, "gas")}
                    </span>
                  </SelectItem>
                  <SelectItem value="electricity">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-600" />
                      {t(locale, "electricity")}
                    </span>
                  </SelectItem>
                  <SelectItem value="water">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-sky-500" />
                      {t(locale, "water")}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utility-name">{t(locale, "name")}</Label>
              <Input
                id="utility-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Gaz Natural / Moldovagaz"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utility-provider">{t(locale, "provider")}</Label>
              <Input
                id="utility-provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="Ex: Moldovagaz / Premier Energy / Apă-Canal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utility-account">
                {t(locale, "accountNumber")}
              </Label>
              <Input
                id="utility-account"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Ex: 123456789"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <Button type="submit">
                <Plus className="mr-1.5 h-4 w-4" />
                {t(locale, "save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Utilities List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {locale === "ru" ? "Список услуг" : "Conturi active"}
          </h2>
          <Badge variant="secondary" className="text-xs">
            {utilities.length}
          </Badge>
        </div>

        {utilities.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">
            {t(locale, "noUtilities")}
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {utilities.map((u) => (
              <Card
                key={u.id}
                className="flex items-center justify-between p-4 border-slate-200/80 bg-white shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-[11px] font-medium bg-slate-50 text-slate-700"
                    >
                      {getUtilityIcon(u.kind)}
                      <span>{utilityKindLabel(locale, u.kind)}</span>
                    </Badge>
                    <span className="font-semibold text-slate-900">{u.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {[u.provider, u.accountNumber].filter(Boolean).join(" · ") ||
                      "—"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUtilityToDelete(u)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:ml-1 text-xs">
                    {t(locale, "delete")}
                  </span>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Meter Readings Section */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-emerald-600" />
            {t(locale, "readings")}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {locale === "ru"
              ? "Фиксируйте последние показания счётчиков по датам"
              : "Înregistrează valorile contoarelor pe date"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {utilities.length > 0 ? (
            <form
              onSubmit={submitReading}
              className="grid gap-3 sm:grid-cols-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="reading-util" className="text-xs">
                  {t(locale, "utility")}
                </Label>
                <Select
                  value={readingUtilityId || utilities[0]?.id || ""}
                  onValueChange={setReadingUtilityId}
                >
                  <SelectTrigger id="reading-util" className="h-9 bg-white">
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

              <div className="space-y-1.5">
                <Label htmlFor="reading-val" className="text-xs">
                  {t(locale, "readingValue")}
                </Label>
                <Input
                  id="reading-val"
                  type="number"
                  step="any"
                  className="h-9 bg-white"
                  value={readingValue}
                  onChange={(e) => setReadingValue(e.target.value)}
                  placeholder="123.4"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reading-date" className="text-xs">
                  {t(locale, "readingDate")}
                </Label>
                <Input
                  id="reading-date"
                  type="date"
                  className="h-9 bg-white"
                  value={readingDate}
                  onChange={(e) => setReadingDate(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-3 pt-1">
                <Button type="submit" size="sm" variant="default">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  {t(locale, "addReading")}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-xs text-slate-500">{t(locale, "noUtilities")}</p>
          )}

          {/* Readings list */}
          <div className="space-y-1.5">
            {readings.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-500">
                {locale === "ru"
                  ? "Пока нет сохранённых показаний"
                  : "Nu există citiri înregistrate"}
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200/80 bg-white">
                {readings
                  .slice()
                  .sort((a, b) => b.readingDate.localeCompare(a.readingDate))
                  .map((r) => {
                    const u = utilities.find((x) => x.id === r.utilityId);
                    return (
                      <li
                        key={r.id}
                        className="flex items-center justify-between p-3 text-xs hover:bg-slate-50/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {u?.name ?? r.utilityId}
                          </span>
                          <Badge variant="secondary" className="font-mono text-[11px]">
                            {r.value}
                          </Badge>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {r.readingDate}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-rose-600"
                          onClick={() => setReadingToDelete(r)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Utility Confirmation Dialog */}
      <Dialog
        open={utilityToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setUtilityToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t(locale, "delete")} — {utilityToDelete?.name}
            </DialogTitle>
            <DialogDescription>
              {locale === "ru"
                ? "Вы уверены? Удаление этой коммунальной услуги также удалит все связанные платежи и показания счётчика. Это действие нельзя отменить."
                : "Ești sigur? Ștergerea acestui cont de utilitate va șterge automat toate plățile și citirile asociate. Această acțiune nu poate fi anulată."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => setUtilityToDelete(null)}
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={confirmDeleteUtility}
            >
              {t(locale, "delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reading Confirmation Dialog */}
      <Dialog
        open={readingToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setReadingToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(locale, "delete")}</DialogTitle>
            <DialogDescription>
              {locale === "ru"
                ? `Удалить показание ${readingToDelete?.value} от ${readingToDelete?.readingDate}?`
                : `Ștergi citirea de ${readingToDelete?.value} din ${readingToDelete?.readingDate}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => setReadingToDelete(null)}
            >
              {t(locale, "cancel")}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={confirmDeleteReading}
            >
              {t(locale, "delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
