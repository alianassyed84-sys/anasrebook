import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import SeedRunner from "@/components/SeedRunner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RebookIndia | India's Book Reuse Revolution",
  description: "India's first organized second-hand book marketplace for students. Save up to 70% on new books.",
  keywords: "second hand books, used books india, NCERT books, NEET books, JEE books, cheap textbooks",
  openGraph: {
    title: "RebookIndia – India's Book Reuse Revolution",
    description: "Buy & sell used books. Save 70% on NCERT, JEE, NEET & college textbooks.",
    url: "https://rebookindia.in",
    siteName: "RebookIndia",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-brand-background dark:bg-gray-950 text-brand-primary dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-300")}>
        <ThemeProvider>
          <DemoBanner />
          <Navbar />
          <div className="flex-1 mt-20">
            <SeedRunner>
              {children}
            </SeedRunner>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
