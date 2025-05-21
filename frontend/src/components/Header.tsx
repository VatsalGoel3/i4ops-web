import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { UserButton } from "@clerk/clerk-react";

export default function Header({ onSidebarToggle }: { onSidebarToggle: () => void }) {
  return (
    <header className="h-14 flex items-center bg-white dark:bg-gray-900 shadow px-4 lg:px-6 z-10">
      <button onClick={onSidebarToggle} className="mr-4 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <span className="text-lg font-semibold tracking-wide">i4ops Console</span>
      <div className="flex-1" />
      <ThemeToggle />
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}