import type { AppData } from "./types";
import { uid } from "./utils";

/** Demo household data for first visit (Chișinău-ish). */
export function createSeedData(): AppData {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1-12
  const prev = m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 };
  const month = (yy: number, mm: number) =>
    `${yy}-${String(mm).padStart(2, "0")}`;
  const thisMonth = month(y, m);
  const lastMonth = month(prev.y, prev.m);

  const gasId = uid("util");
  const elecId = uid("util");
  const waterId = uid("util");

  return {
    version: 1,
    locale: "ro",
    seeded: true,
    utilities: [
      {
        id: gasId,
        kind: "gas",
        name: "Gaz — apartament",
        provider: "Moldovagaz",
        accountNumber: "MG-102938",
        createdAt: now.toISOString(),
      },
      {
        id: elecId,
        kind: "electricity",
        name: "Curent — apartament",
        provider: "Premier Energy",
        accountNumber: "PE-554421",
        createdAt: now.toISOString(),
      },
      {
        id: waterId,
        kind: "water",
        name: "Apă — Apa-Canal",
        provider: "Apa-Canal Chișinău",
        accountNumber: "AC-77881",
        createdAt: now.toISOString(),
      },
    ],
    payments: [
      {
        id: uid("pay"),
        utilityId: gasId,
        amountMdl: 620.5,
        paidAt: `${lastMonth}-28`,
        billingMonth: lastMonth,
        note: "Plată august pentru ciclul iulie — mismatch",
        createdAt: now.toISOString(),
      },
      {
        id: uid("pay"),
        utilityId: elecId,
        amountMdl: 485,
        paidAt: `${thisMonth}-03`,
        billingMonth: thisMonth,
        note: "Achitat integral",
        createdAt: now.toISOString(),
      },
      {
        id: uid("pay"),
        utilityId: waterId,
        amountMdl: 40,
        paidAt: `${thisMonth}-05`,
        billingMonth: thisMonth,
        note: "partial — avans",
        createdAt: now.toISOString(),
      },
      {
        id: uid("pay"),
        utilityId: gasId,
        amountMdl: 710,
        paidAt: `${thisMonth}-08`,
        billingMonth: thisMonth,
        createdAt: now.toISOString(),
      },
    ],
    readings: [
      {
        id: uid("read"),
        utilityId: gasId,
        value: 12450,
        readingDate: `${thisMonth}-01`,
        createdAt: now.toISOString(),
      },
      {
        id: uid("read"),
        utilityId: elecId,
        value: 89320,
        readingDate: `${thisMonth}-01`,
        createdAt: now.toISOString(),
      },
      {
        id: uid("read"),
        utilityId: waterId,
        value: 312.4,
        readingDate: `${lastMonth}-28`,
        createdAt: now.toISOString(),
      },
    ],
  };
}
