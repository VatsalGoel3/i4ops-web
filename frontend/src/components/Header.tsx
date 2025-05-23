import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Menu, Search, Bell } from "lucide-react";
import clsx from "clsx";
import ThemeToggle from "./ThemeToggle";
import { UserButton } from "@clerk/clerk-react";

interface HeaderProps {
  /** toggles the sidebar in mobile view  */
  onSidebarToggle: () => void;
  /** called when the user presses ⏎ in the search box */
  onSearch?: (query: string) => void;
}

export default function Header({ onSidebarToggle, onSearch }: HeaderProps) {
  const [query, setQuery] = useState("");

  /** fire search only when ⏎ is pressed */
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) onSearch(query.trim());
  };

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center gap-4 bg-white/80 dark:bg-surface-dark/80 backdrop-blur px-4 lg:px-6 shadow-sm">
      {/* ───────────────────── Left cluster ───────────────────── */}
      <button
        onClick={onSidebarToggle}
        className="lg:hidden text-gray-500 hover:text-brand focus:outline-none focus-visible:ring"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <span className="font-display text-lg font-semibold tracking-wide whitespace-nowrap">
        i4ops Console
      </span>

      {/* ───────────────────── Center (search) ───────────────────── */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          name="q"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search users & projects…"
          className={clsx(
            "w-full pl-9 pr-3 py-1.5 rounded-xl2",
            "bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900",
            "text-sm focus:outline-none focus-visible:ring"
          )}
        />
      </div>

      {/* ───────────────────── Right cluster ───────────────────── */}
      <ThemeToggle />

      {/* Stubbed bell (disabled until notifications exist) */}
      <button
        className="p-2 text-gray-500 cursor-default"
        aria-label="Notifications (coming soon)"
        disabled
      >
        <Bell className="h-5 w-5" />
      </button>

      <UserButton afterSignOutUrl="/" />
    </header>
  );
}