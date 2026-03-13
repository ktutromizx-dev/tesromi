import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Electronic Warehouse",
  description: "Warehouse Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col`}
      >
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-primary">Warehouse OS</span>
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="text-foreground transition-colors hover:text-foreground/80">Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
