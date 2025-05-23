import { Menu, Search, Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { UserButton } from "@clerk/clerk-react";

export default function Header({ onSidebarToggle }: { onSidebarToggle: () => void }) {
  return (
    <header className="h-14 flex items-center bg-white dark:bg-surface-dark shadow-sm px-4 lg:px-6 gap-4">
      <button onClick={onSidebarToggle} className="lg:hidden text-gray-500 hover:text-brand">
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-display font-semibold tracking-wide hidden sm:block">i4ops Console</h1>

      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          aria-label="Search"
          placeholder="Search…"
          className="w-full pl-9 pr-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:outline-none"
        />
      </div>

      <ThemeToggle />
      <button className="relative p-2 hover:text-brand">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
      </button>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
