import type {
  AppData,
  MeterReading,
  MonthStatus,
  MonthUtilitySummary,
  Payment,
  UtilityAccount,
  UtilityKind,
} from "./types";

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatMdl(amount: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale === "ru" ? "ru-MD" : "ro-MD", {
      style: "currency",
      currency: "MDL",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} MDL`;
  }
}

const MISMATCH_RE =
  /\b(mismatch|neconcordan|цикл|цикл[ауе]|другой|alt ciclu|altă lun[ăa]|wrong month|not for|nu pentru|не за)\b/i;

export function isMismatchNote(note?: string): boolean {
  if (!note) return false;
  return MISMATCH_RE.test(note) || /mismatch/i.test(note);
}

export function computeMonthStatus(
  payments: Payment[],
  expectedMin = 1
): MonthStatus {
  if (payments.length === 0) return "missing";
  if (payments.some((p) => isMismatchNote(p.note))) return "mismatch";
  const sum = payments.reduce((a, p) => a + p.amountMdl, 0);
  if (sum <= 0) return "missing";
  // partial: very small token payment or flagged partial in note
  if (
    payments.some((p) => /partial|parțial|частич/i.test(p.note ?? "")) ||
    (expectedMin > 0 && sum < 50)
  ) {
    return "partial";
  }
  return "paid";
}

export function summarizeMonth(
  utilities: UtilityAccount[],
  payments: Payment[],
  readings: MeterReading[],
  month: string
): MonthUtilitySummary[] {
  return utilities.map((utility) => {
    const monthPayments = payments.filter(
      (p) => p.utilityId === utility.id && p.billingMonth === month
    );
    const utilReadings = readings
      .filter((r) => r.utilityId === utility.id)
      .sort((a, b) => b.readingDate.localeCompare(a.readingDate));
    const lastReading = utilReadings[0];
    return {
      utility,
      paymentsSum: monthPayments.reduce((a, p) => a + p.amountMdl, 0),
      paymentCount: monthPayments.length,
      lastReading,
      status: computeMonthStatus(monthPayments),
    };
  });
}

export function parseCsvPayments(
  csv: string,
  utilities: UtilityAccount[]
): Omit<Payment, "id" | "createdAt">[] {
  const lines = csv
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const start = /utility/i.test(lines[0]) ? 1 : 0;
  const rows: Omit<Payment, "id" | "createdAt">[] = [];

  for (let i = start; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length < 4) continue;
    const [utilityRaw, amountRaw, paidAt, billingMonth, note] = cols;
    const utilityId = resolveUtilityId(utilityRaw.trim(), utilities);
    if (!utilityId) continue;
    const amountMdl = Number(String(amountRaw).replace(",", "."));
    if (!Number.isFinite(amountMdl)) continue;
    rows.push({
      utilityId,
      amountMdl,
      paidAt: paidAt.trim(),
      billingMonth: billingMonth.trim().slice(0, 7),
      note: note?.trim() || undefined,
    });
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQ = !inQ;
      continue;
    }
    if (c === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

function resolveUtilityId(
  raw: string,
  utilities: UtilityAccount[]
): string | null {
  const lower = raw.toLowerCase();
  const kindMap: Record<string, UtilityKind> = {
    gas: "gas",
    gaz: "gas",
    газ: "gas",
    electricity: "electricity",
    electric: "electricity",
    curent: "electricity",
    электричество: "electricity",
    water: "water",
    apa: "water",
    apă: "water",
    вода: "water",
  };
  if (kindMap[lower]) {
    const u = utilities.find((x) => x.kind === kindMap[lower]);
    return u?.id ?? null;
  }
  const byName = utilities.find(
    (u) => u.name.toLowerCase() === lower || u.id === raw
  );
  return byName?.id ?? null;
}

export function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateImport(data: unknown): data is AppData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.utilities) &&
    Array.isArray(d.payments) &&
    Array.isArray(d.readings) &&
    (d.locale === "ro" || d.locale === "ru")
  );
}
