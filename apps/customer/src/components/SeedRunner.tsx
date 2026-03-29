"use client";

import { useEffect } from "react";
import { seedBooks } from "@/lib/seedBooks";
import { seedDemoUsers } from "@/lib/seedUsers";

export default function SeedRunner({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedBooks();
    seedDemoUsers();
  }, []);
  return <>{children}</>;
}
