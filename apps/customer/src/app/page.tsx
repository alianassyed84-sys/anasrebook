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
import { bookActions } from "@rebookindia/appwrite/src/books";
import { BUCKETS } from "@rebookindia/appwrite/src/config";
import type { Book } from "@rebookindia/types";

function getBookImageUrl(imageIds: string[]): string {
  if (!imageIds || imageIds.length === 0) return "";
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    return `${endpoint}/storage/buckets/${BUCKETS.BOOK_IMAGES}/files/${imageIds[0]}/view?project=${projectId}`;
  } catch {
    return "";
  }
}

function toProductScrollFormat(books: Book[]) {
  return books.map((b) => ({
    id: b.bookId,
    title: b.title,
    author: b.author,
    mrp: b.mrp,
    price: b.sellingPrice,
    discount: b.mrp > 0 ? Math.round(((b.mrp - b.sellingPrice) / b.mrp) * 100) : 0,
    condition: b.condition,
    image: getBookImageUrl(b.imageIds),
  }));
}

export default function Home() {
  const [schoolBooks, setSchoolBooks] = useState<ReturnType<typeof toProductScrollFormat>>([]);
  const [neetBooks, setNeetBooks] = useState<ReturnType<typeof toProductScrollFormat>>([]);
  const [allBooks, setAllBooks] = useState<ReturnType<typeof toProductScrollFormat>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await bookActions.getAllBooks();
        setAllBooks(toProductScrollFormat(all.slice(0, 10)));

        const school = all.filter((b) => b.category === "school");
        setSchoolBooks(toProductScrollFormat(school.slice(0, 8)));

        const neet = all.filter((b) => b.category === "neet");
        setNeetBooks(toProductScrollFormat(neet.slice(0, 8)));
      } catch (err) {
        console.error("Failed to fetch books for homepage", err);
      }
    };
    fetchData();
  }, []);

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
        subtitle="Best-selling NEET & JEE preparation books at 50% off."
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

