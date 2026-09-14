import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Factură Clară",
  description:
    "Înțelege facturile la gaz, curent și apă — pe luni, în lei. Moldova-first utility bill clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <Nav />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
          <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
            Factură Clară · MVP local-first · MDL
          </footer>
        </Providers>
      </body>
    </html>
  );
}
