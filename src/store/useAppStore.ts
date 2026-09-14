"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSeedData } from "@/lib/seed";
import type {
  AppData,
  Locale,
  MeterReading,
  Payment,
  UtilityAccount,
} from "@/lib/types";
import { uid } from "@/lib/utils";

interface AppState {
  hydrated: boolean;
  locale: Locale;
  utilities: UtilityAccount[];
  payments: Payment[];
  readings: MeterReading[];
  seeded: boolean;
  selectedMonth: string;
  setHydrated: (v: boolean) => void;
  setLocale: (locale: Locale) => void;
  setSelectedMonth: (month: string) => void;
  addUtility: (input: Omit<UtilityAccount, "id" | "createdAt">) => void;
  updateUtility: (id: string, patch: Partial<UtilityAccount>) => void;
  deleteUtility: (id: string) => void;
  addPayment: (input: Omit<Payment, "id" | "createdAt">) => void;
  deletePayment: (id: string) => void;
  addReading: (input: Omit<MeterReading, "id" | "createdAt">) => void;
  deleteReading: (id: string) => void;
  importPayments: (rows: Omit<Payment, "id" | "createdAt">[]) => void;
  exportData: () => AppData;
  importData: (data: AppData) => void;
  resetData: () => void;
  ensureSeed: () => void;
}

function emptyMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      locale: "ro",
      utilities: [],
      payments: [],
      readings: [],
      seeded: false,
      selectedMonth: emptyMonth(),

      setHydrated: (v) => set({ hydrated: v }),
      setLocale: (locale) => set({ locale }),
      setSelectedMonth: (selectedMonth) => set({ selectedMonth }),

      addUtility: (input) =>
        set((s) => ({
          utilities: [
            ...s.utilities,
            { ...input, id: uid("util"), createdAt: new Date().toISOString() },
          ],
        })),

      updateUtility: (id, patch) =>
        set((s) => ({
          utilities: s.utilities.map((u) =>
            u.id === id ? { ...u, ...patch, id: u.id } : u
          ),
        })),

      deleteUtility: (id) =>
        set((s) => ({
          utilities: s.utilities.filter((u) => u.id !== id),
          payments: s.payments.filter((p) => p.utilityId !== id),
          readings: s.readings.filter((r) => r.utilityId !== id),
        })),

      addPayment: (input) =>
        set((s) => ({
          payments: [
            {
              ...input,
              id: uid("pay"),
              createdAt: new Date().toISOString(),
            },
            ...s.payments,
          ],
        })),

      deletePayment: (id) =>
        set((s) => ({
          payments: s.payments.filter((p) => p.id !== id),
        })),

      addReading: (input) =>
        set((s) => ({
          readings: [
            {
              ...input,
              id: uid("read"),
              createdAt: new Date().toISOString(),
            },
            ...s.readings,
          ],
        })),

      deleteReading: (id) =>
        set((s) => ({
          readings: s.readings.filter((r) => r.id !== id),
        })),

      importPayments: (rows) =>
        set((s) => ({
          payments: [
            ...rows.map((r) => ({
              ...r,
              id: uid("pay"),
              createdAt: new Date().toISOString(),
            })),
            ...s.payments,
          ],
        })),

      exportData: () => {
        const s = get();
        return {
          version: 1 as const,
          locale: s.locale,
          utilities: s.utilities,
          payments: s.payments,
          readings: s.readings,
          seeded: s.seeded,
        };
      },

      importData: (data) =>
        set({
          locale: data.locale ?? "ro",
          utilities: data.utilities ?? [],
          payments: data.payments ?? [],
          readings: data.readings ?? [],
          seeded: true,
        }),

      resetData: () => {
        const seed = createSeedData();
        set({
          locale: seed.locale,
          utilities: seed.utilities,
          payments: seed.payments,
          readings: seed.readings,
          seeded: true,
          selectedMonth: emptyMonth(),
        });
      },

      ensureSeed: () => {
        const s = get();
        if (!s.seeded && s.utilities.length === 0 && s.payments.length === 0) {
          const seed = createSeedData();
          set({
            locale: seed.locale,
            utilities: seed.utilities,
            payments: seed.payments,
            readings: seed.readings,
            seeded: true,
          });
        }
      },
    }),
    {
      name: "factura-clara-v1",
      partialize: (s) => ({
        locale: s.locale,
        utilities: s.utilities,
        payments: s.payments,
        readings: s.readings,
        seeded: s.seeded,
        selectedMonth: s.selectedMonth,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        state?.ensureSeed();
      },
    }
  )
);
