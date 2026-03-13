"use client";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-14 h-7 rounded-full transition-all
        duration-300 focus:outline-none focus:ring-2
        focus:ring-accent focus:ring-offset-2
        bg-gray-200 dark:bg-[#1B3A6B]"
    >
      {/* Sliding circle */}
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full
          flex items-center justify-center shadow-md
          transition-all duration-300 transform
          bg-white dark:bg-[#E8962E]
          ${theme === "dark" ? "translate-x-7" : "translate-x-0"}`}
      >
        {theme === "dark"
          ? <Moon size={13} className="text-white" />
          : <Sun size={13} className="text-yellow-500" />
        }
      </span>

      {/* Icons on track */}
      <Sun size={11} className="absolute left-1.5 top-2 text-yellow-400
        dark:opacity-0 opacity-100 transition-opacity" />
      <Moon size={11} className="absolute right-1.5 top-2 text-blue-300
        opacity-0 dark:opacity-100 transition-opacity" />
    </button>
  );
}
