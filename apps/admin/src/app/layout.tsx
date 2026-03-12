import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminShell } from "@/components/layout/AdminShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RebookIndia Admin | Dashboard",
  description: "RebookIndia platform administration dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
