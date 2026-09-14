export type UtilityKind = "gas" | "electricity" | "water";

export type Locale = "ro" | "ru";

export interface UtilityAccount {
  id: string;
  kind: UtilityKind;
  name: string;
  provider?: string;
  accountNumber?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  utilityId: string;
  amountMdl: number;
  paidAt: string; // YYYY-MM-DD
  billingMonth: string; // YYYY-MM
  note?: string;
  receiptFilename?: string;
  createdAt: string;
}

export interface MeterReading {
  id: string;
  utilityId: string;
  value: number;
  readingDate: string; // YYYY-MM-DD
  createdAt: string;
}

export type MonthStatus = "paid" | "partial" | "missing" | "mismatch";

export interface AppData {
  version: 1;
  locale: Locale;
  utilities: UtilityAccount[];
  payments: Payment[];
  readings: MeterReading[];
  seeded: boolean;
}

export interface MonthUtilitySummary {
  utility: UtilityAccount;
  paymentsSum: number;
  paymentCount: number;
  lastReading?: MeterReading;
  status: MonthStatus;
}
