"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ShinyText } from "@/components/ShinyText";

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
              <div className="text-sm font-bold text-slate-900">
                <ShinyText text={t(locale, "appTitle")} />
              </div>
              <div className="hidden text-xs text-slate-500 sm:block">
                {t(locale, "tagline")}
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex flex-wrap items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <Button
                key={l.href}
                asChild
                variant={active ? "default" : "ghost"}
                size="sm"
              >
                <Link href={l.href}>{t(locale, l.key)}</Link>
              </Button>
            );
          })}
          <div className="ml-2 flex rounded-lg border border-slate-200 p-0.5 text-xs font-semibold">
            <Button
              type="button"
              variant={locale === "ro" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLocale("ro")}
              className="h-7 px-2 text-xs"
            >
              RO
            </Button>
            <Button
              type="button"
              variant={locale === "ru" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLocale("ru")}
              className="h-7 px-2 text-xs"
            >
              RU
            </Button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:hidden">
            <nav className="flex flex-col gap-2 mt-8">
              {links.map((l) => {
                const active =
                  l.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(l.href);
                return (
                  <Button
                    key={l.href}
                    asChild
                    variant={active ? "default" : "ghost"}
                    className="justify-start"
                  >
                    <Link href={l.href}>{t(locale, l.key)}</Link>
                  </Button>
                );
              })}
              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  variant={locale === "ro" ? "default" : "outline"}
                  onClick={() => setLocale("ro")}
                  className="flex-1"
                >
                  RO
                </Button>
                <Button
                  type="button"
                  variant={locale === "ru" ? "default" : "outline"}
                  onClick={() => setLocale("ru")}
                  className="flex-1"
                >
                  RU
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
