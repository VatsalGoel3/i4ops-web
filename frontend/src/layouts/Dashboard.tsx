// src/layouts/Dashboard.tsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Users, FolderKanban } from "lucide-react";
import clsx from "clsx";

const links = [
  { to: "/users", label: "Users", icon: Users },
  { to: "/projects", label: "Projects", icon: FolderKanban },
];

export default function Dashboard() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-surface dark:bg-surface-dark text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        className={clsx(
          "bg-white dark:bg-gray-900 shadow-lg lg:shadow-none transition-all",
          open ? "w-52" : "w-14"
        )}
      >
        <div className="py-3" />
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700",
                isActive && "bg-gray-100 dark:bg-gray-700 font-medium"
              )
            }
          >
            <l.icon className="h-5 w-5 shrink-0" />
            <span className={clsx(!open && "hidden lg:block")}>{l.label}</span>
          </NavLink>
        ))}
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSidebarToggle={() => setOpen(!open)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}