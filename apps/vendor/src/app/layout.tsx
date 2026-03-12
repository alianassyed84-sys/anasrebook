import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VendorShell } from "@/components/layout/VendorShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RebookIndia Vendor | Dashboard",
  description: "RebookIndia platform vendor dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VendorShell>{children}</VendorShell>
      </body>
    </html>
  );
}
