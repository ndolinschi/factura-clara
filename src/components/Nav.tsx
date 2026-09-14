"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";

const links = [
  { href: "/", key: "navDashboard" as const },
  { href: "/utilities", key: "navUtilities" as const },
  { href: "/payments", key: "navPayments" as const },
  { href: "/settings", key: "navSettings" as const },
];

export function Nav() {
  const pathname = usePathname();
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm">
              FC
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {t(locale, "appTitle")}
              </div>
              <div className="hidden text-xs text-slate-500 sm:block">
                {t(locale, "tagline")}
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t(locale, l.key)}
              </Link>
            );
          })}
          <div className="ml-2 flex rounded-lg border border-slate-200 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLocale("ro")}
              className={`rounded-md px-2 py-1 ${
                locale === "ro"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600"
              }`}
            >
              RO
            </button>
            <button
              type="button"
              onClick={() => setLocale("ru")}
              className={`rounded-md px-2 py-1 ${
                locale === "ru"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600"
              }`}
            >
              RU
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
