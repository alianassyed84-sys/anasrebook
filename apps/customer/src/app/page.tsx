"use client";

import React, { useEffect, useState } from "react";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductScroll } from "@/components/home/ProductScroll";
import { BookPassBanner } from "@/components/home/BookPassBanner";
import { FeaturedVendors } from "@/components/home/FeaturedVendors";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { ImpactCounter } from "@/components/home/ImpactCounter";
import { AppDownload } from "@/components/home/AppDownload";
import { Newsletter } from "@/components/home/Newsletter";
import { databases, DB_ID, COLLECTIONS } from "@rebookindia/firebase";

const DUMMY_IMAGES = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?q=80&w=600&auto=format&fit=crop",
];

function getBookImage(title: string) {
  const idx = (title?.charCodeAt(0) || 0) % DUMMY_IMAGES.length;
  return DUMMY_IMAGES[idx];
}

function toScrollFormat(books: any[]) {
  return books.map((b) => ({
    id: b.$id || b.id,
    title: b.title,
    author: b.author,
    mrp: Number(b.mrp) || 0,
    price: Number(b.sellingPrice) || 0,
    discount: b.mrp > 0 ? Math.round(((b.mrp - b.sellingPrice) / b.mrp) * 100) : 0,
    condition: b.condition,
    image: getBookImage(b.title),
    isbn: b.isbn,
    coverUrl: b.coverUrl,
  }));
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [schoolBooks, setSchoolBooks] = useState<any[]>([]);
  const [neetBooks, setNeetBooks] = useState<any[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [allRes, schoolRes, neetRes] = await Promise.all([
          databases.listDocuments(DB_ID, COLLECTIONS.BOOKS, [{ type: "limit", value: 10 }]),
          databases.listDocuments(DB_ID, COLLECTIONS.BOOKS, [{ type: "where", field: "category", operator: "==", value: "school" }]),
          databases.listDocuments(DB_ID, COLLECTIONS.BOOKS, [{ type: "where", field: "category", operator: "==", value: "neet" }]),
        ]);
        setAllBooks(toScrollFormat(allRes.documents));
        setSchoolBooks(toScrollFormat(schoolRes.documents.slice(0, 8)));
        setNeetBooks(toScrollFormat(neetRes.documents.slice(0, 8)));
      } catch (err) {
        console.error("Failed to fetch books for homepage", err);
      }
    };
    fetchData();
  }, []);

  if (!mounted) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Hero />
        <div className="h-96" /> {/* Placeholder */}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <StatsBar />
      <CategoryGrid />

      <ProductScroll
        title="Top Pick NCERTs"
        subtitle="Verified sellers, near-new condition, unbeatable prices."
        books={schoolBooks.length > 0 ? schoolBooks : allBooks}
        viewAllHref="/books?category=school"
      />

      <BookPassBanner />

      <ProductScroll
        title="Competitive Edge"
        subtitle="Best-selling NEET &amp; JEE preparation books at 50% off."
        books={neetBooks.length > 0 ? neetBooks : allBooks}
        viewAllHref="/books?category=neet"
      />

      <HowItWorks />
      <FeaturedVendors />
      <Testimonials />
      <ImpactCounter />
      <AppDownload />
      <Newsletter />
    </main>
  );
}

